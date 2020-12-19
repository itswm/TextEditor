import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { delay, filter, map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class TreeService {

    constructor(private _http: HttpClient) {}

    public getTree(): Observable<any[]> {
        return this._http.get<any[]>('assets/data.json').pipe(
            delay(1000),
            filter((nodes: any[]) => !!nodes),
            map((nodes: any[]) => (nodes.map(node => ({ ...node, selected: false })) || []))
        );
    }
}