import { HttpHeaders } from "@angular/common/http";

export const environment = {
    baseUri: "http://meanstacktemplate-com-br.umbler.net/api",
    headers: new HttpHeaders().set("Content-Type", "application/json"),
};
