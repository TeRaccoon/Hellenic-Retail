import { YesNo } from './checkout';

export interface Card {
  id: number;
  page_section_id: number;
  text_content: string;
  element_type: ElementType;
  image_file_name: string;
  visible: YesNo;
  name: string;
}

export enum ElementType {
  Paragraph = 'Paragraph',
  Header = 'Header',
  Other = 'Other',
}
