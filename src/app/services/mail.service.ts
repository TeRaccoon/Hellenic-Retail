import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Response } from '../common/types/data-response';
import { UrlService } from './url.service';
import { RegistrationForm } from '../common/types/account';
import { ConstManager, settingKeys } from '../common/const/const-manager';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  url: string;
  supportEmail: string;

  constructor(
    private urlService: UrlService,
    private http: HttpClient,
    private consts: ConstManager
  ) {
    this.url = this.urlService.getUrl('mail');
    this.supportEmail = consts.getConstant(settingKeys.support_email);
  }

  async sendEmail(data: any): Promise<Response> {
    return await lastValueFrom(
      this.http.post<Response>(this.url, data, { withCredentials: true })
    );
  }

  generateForgotPasswordEmail(password: string) {
    let email = `
    <html>
    <head>
        <title>Forgotten Password</title>
        <meta charset="UTF-8">
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 30%;
            min-width: 450px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #007bff;
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            margin: 10px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #007bff;
            color: #fff;
        }
        .total-row {
            font-weight: bold;
        }
        .total-row td {
            text-align: right;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #555;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Password reset</h1>
            <p>Dear Customer,</p>
            <p>A request has been made to reset your password. Below is your temporary password: </p>
            <table>
                <tr>
                    <th>Password</th>
                </tr>
                <tr>
                    <td>${password}</td>
                </tr>

            </table>
            <p>If this wasn't you, please send an email to ${this.supportEmail}</p>
            <p>Thank you for choosing our service!</p>
            <div class="footer">
                <p>Best regards,</p>
                <p>Hellenic Grocery</p>
            </div>
        </div>
    </body>
    </html>`;

    return email;
  }

  generateCustomerMessageEmail(messageData: any) {
    let email = `
    <html>
    <head>
        <title>New Message from ${messageData.name}</title>
        <meta charset="UTF-8">
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #007bff;
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            margin: 10px 0;
        }
        .message-details {
            margin-bottom: 20px;
        }
        .message-content {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #555;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>New Customer Message</h1>
            <p>Dear Team,</p>
            <p>You have received a new message from a customer. Here are the details:</p>
            <div class="message-details">
                <p><strong>Name:</strong> ${messageData.name}</p>
                <p><strong>Email:</strong> <a href="mailto:${messageData.email}">${messageData.email}</a></p>
            </div>
            <div class="message-content">
                <p>${messageData.message}</p>
            </div>
            <p>Please respond to the customer as soon as possible.</p>
            <div class="footer">
                <p>Best regards,</p>
                <p>Hellenic Grocery Support Team</p>
            </div>
        </div>
    </body>
    </html>`;

    return email;
  }

  generateOrderConfirmationEmail(emailData: any) {
    let email = `
    <html>
    <head>
        <title>Order ${emailData.reference}</title>
        <meta charset="UTF-8">
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #007bff;
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            margin: 10px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #007bff;
            color: #fff;
        }
        .total-row {
            font-weight: bold;
        }
        .total-row td {
            text-align: right;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #555;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Order Confirmation: ${emailData.reference}</h1>
            <p>Dear Customer,</p>
            <p>Thank you for your order! Your order has been received and is now being processed. Your order details are as follows:</p>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>`;

    for (let product of emailData.products) {
      email += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td style='text-align: right;'>${product.price}</td>
                </tr>`;
    }

    email += `
                <tr class="total-row">
                    <td colspan="2">Net Total</td>
                    <td>${emailData.net_total}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="2">VAT</td>
                    <td>${emailData.vat}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="2">Delivery</td>
                    <td>${emailData.delivery}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="2">Savings</td>
                    <td>${emailData.discount_value}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="2">Total</td>
                    <td>${emailData.total}</td>
                </tr>
            </table>
            <p>We will send you another email when your order is on its way.</p>
            <p>Thank you for choosing our service!</p>
            <div class="footer">
                <p>Best regards,</p>
                <p>Hellenic Grocery</p>
            </div>
        </div>
    </body>
    </html>`;

    return email;
  }

  generateAccountCreationEmail(
    accountData: RegistrationForm,
    passwordless = true
  ) {
    let email = `
    <html>
    <head>
        <title>Welcome to Hellenic Grocery</title>
        <meta charset="UTF-8">
        <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 40%;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #007bff;
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            margin: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #555;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #007bff;
            color: #fff;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Hellenic Grocery, ${accountData.forename}!</h1>
            <p>Dear ${accountData.forename + ' ' + accountData.surname},</p>
            <br>
            <p>Thank you for creating an account with us! We are thrilled to have you on board.</p>
            <p>Your account has been successfully created and is now ready to use. You can log in anytime using the credentials you provided during registration.</p>`;
    if (passwordless) {
      email += `
                      <p>Below is your temporary password:</p>
                      <table>
                          <tr>
                              <th>Password</th>
                          </tr>
                          <tr>
                              <td>${accountData.password}</td>
                          </tr>
                      </table>`;
    }
    email += `<p>If you have any questions or need assistance, please do not hesitate to reach out to our support team at ${this.supportEmail}.</p>
            <p>We look forward to providing you with an excellent experience.</p>
            <div class="footer">
                <p>Best regards,</p>
                <p>Hellenic Grocery Team</p>
            </div>
        </div>
    </body>
    </html>`;

    return email;
  }
}
