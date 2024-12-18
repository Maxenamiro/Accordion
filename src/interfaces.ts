import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAccordeon {
    Id: number;
    Title: string;
    Body: string;
    Letter: string;
    context: WebPartContext;
}
