export interface FuseNavigationItem {
    id: string;
    title: string;
    type: "item" | "group" | "collapsable";
    translate?: string;
    icon?: string;
    hidden?: boolean;
    url?: string;
    classes?: string;
    exactMatch?: boolean;
    externalUrl?: boolean;
    openInNewTab?: boolean;
    id_interno?: string;
    id_tarea?: string;
    function?: any;
    iframe?: any;
    urlIframe?: string;
    badge?: {
        title?: string;
        translate?: string;
        bg?: string;
        fg?: string;
    };
    children?: FuseNavigationItem[];
}

export interface FuseNavigation extends FuseNavigationItem {
    children?: FuseNavigationItem[];
}
