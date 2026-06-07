import { Filter } from '../Filter';
// Filter for a multi-select that supports per-entry polarity (include/exclude).
//
// Canonical value = flat string array of tokens, where an excluded id carries
// an `n-` prefix: e.g. ['2', '4', 'n-5', 'n-6'] (include 2,4; exclude 5,6).
// This is exactly what the server echoes back in `used_filters`, what gets sent
// in the request body, and — comma-joined — the query string (`2,4,n-5,n-6`).
// Keeping one shape for value/query/request/used_filters avoids conversion bugs
// when the value round-trips through the response.
//
// Plain ids without prefix are includes, so an include-only value (`2,4`) stays
// backward compatible with a normal select filter query.
//
// The wrapper component (ListFilterSelect2) converts between this token array
// and the {model, polarity} objects that ASelect2 works with.
//
// Note: the client-side base is `Filter` (not `SelectFilter`, which is empty on
// the client). The matching server filter extends the real `SelectFilter`.
//
// `any`-Signaturen: Die Basis-Methoden arbeiten mit dem weiten
// `ActionFilterValueType`. Der Wert hier ist ein string[]; die Parameter als
// `any` zu typen ist einfacher, als die Shared-Union anzufassen.
export class PolarizedSelectFilter extends Filter {
    valueToQuery(value) {
        const tokens = value;
        if (!tokens || !tokens.length) {
            return undefined;
        }
        return tokens.join(',');
    }
    queryToValue(query) {
        if (!query) {
            return undefined;
        }
        return query.split(',');
    }
}
PolarizedSelectFilter.type = 'Afeefa.PolarizedSelectFilter';
