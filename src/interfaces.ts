import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAccordeon {
    Id: number;
    Title: string;
    field_1: string;
    Letter: string;
    context: WebPartContext;
}
