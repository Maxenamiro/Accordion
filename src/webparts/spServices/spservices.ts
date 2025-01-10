import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
// import { FileSystemObjectType } from "../ImageBlockWebPart";

export interface SiteListReponse {
    Id: string,
    Title: string,
    Attachments?: boolean,
    "odata.editLink": string,
    "odata.etag": string
    "odata.id": string,
    "odata.type": string
}

export default class spservices {
    private sp: SPFI;
    // private context: WebPartContext;


    constructor(private context: WebPartContext) {
        // Setup Context to PnPjs and MSGraph
        console.log("Sharepoint fetching service", this.sp);
        this.sp = spfi().using(spSPFx(this.context));
        this.context = context;
        this.onInit();
    }

    // OnInit Function
    private onInit(): void {
        console.log("Sp service init");
    }

    public async getSiteLists(siteUrl: string): Promise<SiteListReponse[]> {
        let results: SiteListReponse[] = [];
        if (!siteUrl) {
            return [];
        }
        try {
            const web = Web(siteUrl).using(spSPFx(this.context));
            results = await web.lists
                .select("Title", "ID")
                .filter('BaseTemplate eq 100')()

            console.log("Get Site List  : ", results);

        } catch (error) {
            return Promise.reject(error);
        }
        return results;
    }

   
    public async getImagesAttachments(siteUrl: string, listId: string, numberImages: number): Promise<{
        Attachments: boolean,
        "odata.editLink": string,
        "odata.etag": string
        "odata.id": string,
        "odata.type": string
    }[]> {
        let results = [];
        try {
            const web = Web(siteUrl).using(spSPFx(this.context));
            results = await web.lists.getByTitle(listId).items.select("Attachments")();
            // .expand('AttachmentFiles')();
        } catch (error) {
            // console.log("getImageserror : ", error);
        }
        return results;
    }

    
	public async getAccordeonItems(siteUrl: string, list: string): Promise<any> {
		try {
            const web = Web(siteUrl).using(spSPFx(this.context));

			const items = await web.lists
				.getById(list)
				.items.select()
				// .orderBy('Letter', true)
				// .orderBy('Title', true)
                ()
			console.log('Fetched items:', items)
			// setAccordeonItems(items)
			return items;
		} catch (error) {
			console.error('Error fetching items:', error)
		}
	}

}
