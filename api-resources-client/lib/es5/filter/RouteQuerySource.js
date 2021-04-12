import { BaseQuerySource } from './BaseQuerySource';
export class RouteQuerySource extends BaseQuerySource {
    constructor(router) {
        super();
        this.router = null;
        this.router = router;
    }
    getQuery() {
        return this.router.currentRoute.query;
    }
    push(query) {
        if (JSON.stringify(this.router.currentRoute.query) !== JSON.stringify(query)) {
            this.router.push({ query });
        }
    }
}
