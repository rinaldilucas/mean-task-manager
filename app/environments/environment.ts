import { HttpHeaders } from "@angular/common/http";

export const environment = {
    baseUri: "http://localhost:3000/api",
    headers: new HttpHeaders().set("Content-Type", "application/json"),
};
