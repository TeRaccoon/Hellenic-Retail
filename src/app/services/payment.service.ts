import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { lastValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root',
})

export class PaymentService {
	payload: string = "";
	merchant_id = "Hellenicgrocery_UK";
	request_host = "api.smartpayfuse-test.barclaycard";
	merchant_secret_key = "bXeC2kwurQtAP5y6Uf8pkaLnOKiSuTUaDj81zu1jQ+U=";
	merchant_key_id = "0c3607e7-1765-488f-ac9b-c448f1aa4440";

	constructor(private http: HttpClient) { }

	async processPayment(formData: any) {
		this.payload = this.craftPayload(formData);

    console.log(this.payload);
		return this.processPost();
	}

	async processPost(): Promise<any> {
		const resource = "/pts/v2/payments/";
		const method = "post";
		let statusCode = -1;
		const url = `https://${this.request_host}${resource}`;

		const date = new Date().toUTCString();

		let headers = new HttpHeaders({
			'Accept': 'application/hal+json;charset=utf-8',
			'Content-Type': 'application/json'
		});

		const authHeaders = this.getHttpSignature(resource, method, date);
		headers = headers.append('Authorization', authHeaders.join(', '));

		const options = { headers: headers, observe: 'response' as 'body' };

		try {
			const response = await lastValueFrom(this.http.post(url, this.payload, options));
      console.log(response);
			return this.handleResponse(response);
		} catch (error) {
			console.error(error);
			return error;
		}
	}

	getHttpSignature(
		resourcePath: string,
		httpMethod: string,
		currentDate: string
	): string[] {
		let digest = '';

		let signatureString = '';
		let headerString = '';

		if (httpMethod === 'get') {
			signatureString = `host: ${this.request_host}\ndate: ${currentDate}\nrequest-target: ${httpMethod} ${resourcePath}\nv-c-merchant-id: ${this.merchant_id}`;
			headerString = 'host date request-target v-c-merchant-id';
		} else if (httpMethod === 'post') {
			digest = this.generateDigest(this.payload);

			signatureString = `host: ${this.request_host}\ndate: ${currentDate}\nrequest-target: ${httpMethod} ${resourcePath}\ndigest: SHA-256=${digest}\nv-c-merchant-id: ${this.merchant_id}`;
			headerString = 'host date request-target digest v-c-merchant-id';
		}

		const signatureByteString = new TextEncoder().encode(signatureString);
		const decodeKey = CryptoJS.enc.Base64.parse(this.merchant_secret_key);
		const signatureByteStringWordArray = CryptoJS.lib.WordArray.create(signatureByteString);
		const signature = CryptoJS.enc.Base64.stringify(
			CryptoJS.HmacSHA256(signatureByteStringWordArray, decodeKey)
		);
		const signatureHeader = [
			`keyid="${this.merchant_key_id}"`,
			'algorithm="HmacSHA256"',
			`headers="${headerString}"`,
			`signature="${signature}"`,
		];

		const signatureToken = 'Signature:' + signatureHeader.join(', ');

		const host = 'Host:' + this.request_host;
		const vcMerchant = 'v-c-merchant-id:' + this.merchant_id;
		let headers = [vcMerchant, signatureToken, host, 'Date:' + currentDate];

		if (httpMethod === 'post') {
			headers = [...headers, `Digest: SHA-256=${digest}`];
		}

		return headers;
	}

	generateDigest(requestPayload: string): string {
		const utf8EncodedString = new TextEncoder().encode(requestPayload);
		const utf8EncodedStringWordArray = CryptoJS.lib.WordArray.create(utf8EncodedString);
		const digestEncode = CryptoJS.SHA256(utf8EncodedStringWordArray);
		return CryptoJS.enc.Base64.stringify(digestEncode);
	}

	craftPayload(formData: any) {
		const paymentData = {
			clientReferenceInformation: {
				code: formData['First Name'] + '_' + Math.floor(Math.random() * 1000) // Generate unique code
			},
			processingInformation: {
				capture: true,
			},
			paymentInformation: {
				card: {
					number: formData['Card Number'],
					expirationMonth: formData['Expiry Date'].split('/')[0],
					expirationYear: formData['Expiry Date'].split('/')[1],
					securityCode: formData['CVC']
				}
			},
			orderInformation: {
				amountDetails: {
					totalAmount: "999.99",
					currency: "GBP"
				},
				billTo: {
					firstName: formData['First Name'],
					lastName: formData['Last Name'],
					address1: formData['Street Address'],
					locality: formData['Town / City'],
					administrativeArea: formData['County'],
					postalCode: formData['Postcode'],
					country: "GB",
					email: formData['Email address'],
					phoneNumber: formData['Phone']
				}
			}
		};

		const paymentDataString = JSON.stringify(paymentData, null, 2);

		return paymentDataString;
	}

	handleResponse(response: any) {
    console.log(JSON.parse(response));
	}
}
