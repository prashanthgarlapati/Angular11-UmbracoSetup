
export interface UmbracoData {
    welcomeTitle: String;
    paragraphText: String;
    description: String;
    name: String;
    contentTypeAlias: String;
    image: any;
}

export interface UmbracoDropdown {
    menu: [];
    name: String;
    parentId: number;
    submenuItems: [];
    sortOrder: number;
}