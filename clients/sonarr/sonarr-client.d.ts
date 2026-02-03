export interface paths {
    "/api": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: {
                    returnUrl?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "multipart/form-data": {
                        username?: string;
                        password?: string;
                        rememberMe?: string;
                    };
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/system/backup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BackupResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/system/backup/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/system/backup/restore/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/system/backup/restore/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/blocklist": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    page?: number;
                    pageSize?: number;
                    sortKey?: string;
                    sortDirection?: components["schemas"]["SortDirection"];
                    seriesIds?: number[];
                    protocols?: components["schemas"]["DownloadProtocol"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BlocklistResourcePagingResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/blocklist/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/blocklist/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["BlocklistBulkResource"];
                    "text/json": components["schemas"]["BlocklistBulkResource"];
                    "application/*+json": components["schemas"]["BlocklistBulkResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/calendar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    start?: string;
                    end?: string;
                    includeUnmonitored?: boolean;
                    includeSpecials?: boolean;
                    tags?: string;
                    includeSubresources?: components["schemas"]["CalendarSubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EpisodeResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/calendar/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EpisodeResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/feed/v5/calendar/sonarr.ics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    pastDays?: number;
                    futureDays?: number;
                    tags?: string;
                    unmonitored?: boolean;
                    premieresOnly?: boolean;
                    asAllDay?: boolean;
                    includeSpecials?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/command": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CommandResource"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CommandResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CommandResource"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/command/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CommandResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/connection": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ConnectionResource"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: {
                    forceSave?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ConnectionResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ConnectionResource"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/connection/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ConnectionResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: {
                    forceSave?: boolean;
                };
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ConnectionResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ConnectionResource"];
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/connection/schema": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ConnectionResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/connection/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: {
                    forceTest?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ConnectionResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/connection/testall": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/connection/action/{name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    name: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ConnectionResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/customfilter": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CustomFilterResource"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CustomFilterResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["CustomFilterResource"];
                        "application/json": components["schemas"]["CustomFilterResource"];
                        "text/json": components["schemas"]["CustomFilterResource"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/customfilter/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CustomFilterResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CustomFilterResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["CustomFilterResource"];
                        "application/json": components["schemas"]["CustomFilterResource"];
                        "text/json": components["schemas"]["CustomFilterResource"];
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/wanted/cutoff": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    page?: number;
                    pageSize?: number;
                    sortKey?: string;
                    sortDirection?: components["schemas"]["SortDirection"];
                    monitored?: boolean;
                    includeSubresources?: components["schemas"]["CutoffSubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EpisodeResourcePagingResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/wanted/cutoff/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EpisodeResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/diskspace": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DiskSpaceResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/episode": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    seriesId?: number;
                    seasonNumber?: number;
                    episodeIds?: number[];
                    episodeFileId?: number;
                    includeSubresources?: components["schemas"]["EpisodeSubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EpisodeResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/episode/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EpisodeResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["EpisodeResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["EpisodeResource"];
                        "application/json": components["schemas"]["EpisodeResource"];
                        "text/json": components["schemas"]["EpisodeResource"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/episode/monitor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: {
            parameters: {
                query?: {
                    includeSubresources?: components["schemas"]["EpisodeSubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["EpisodesMonitoredResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/episodefile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    seriesId?: number;
                    episodeFileIds?: number[];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EpisodeFileResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/episodefile/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EpisodeFileResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["EpisodeFileResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["EpisodeFileResource"];
                        "application/json": components["schemas"]["EpisodeFileResource"];
                        "text/json": components["schemas"]["EpisodeFileResource"];
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/episodefile/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["EpisodeFileResource"][];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["EpisodeFileListResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/filesystem": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    path?: string;
                    includeFiles?: boolean;
                    allowFoldersWithoutTrailingSlashes?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/filesystem/type": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    path?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/filesystem/mediafiles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    path?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["HealthResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    page?: number;
                    pageSize?: number;
                    sortKey?: string;
                    sortDirection?: components["schemas"]["SortDirection"];
                    eventType?: number[];
                    episodeId?: number;
                    downloadId?: string;
                    seriesIds?: number[];
                    languages?: number[];
                    quality?: number[];
                    includeSubresources?: components["schemas"]["HistorySubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["HistoryResourcePagingResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/history/since": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    date?: string;
                    eventType?: components["schemas"]["EpisodeHistoryEventType"];
                    includeSubresources?: components["schemas"]["HistorySubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["HistoryResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/history/series": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    seriesId?: number;
                    eventType?: components["schemas"]["EpisodeHistoryEventType"];
                    includeSubresources?: components["schemas"]["HistorySubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["HistoryResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/history/season": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    seriesId?: number;
                    seasonNumber?: number;
                    eventType?: components["schemas"]["EpisodeHistoryEventType"];
                    includeSubresources?: components["schemas"]["HistorySubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["HistoryResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/history/episode": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    episodeId?: number;
                    eventType?: components["schemas"]["EpisodeHistoryEventType"];
                    includeSubresources?: components["schemas"]["HistorySubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["HistoryResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/history/failed/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/localization": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LocalizationResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/localization/language": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LocalizationLanguageResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/localization/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LocalizationResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    page?: number;
                    pageSize?: number;
                    sortKey?: string;
                    sortDirection?: components["schemas"]["SortDirection"];
                    level?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LogResourcePagingResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/log/file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LogFileResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/log/file/{filename}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    filename: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/manualimport": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    folder?: string;
                    downloadIds?: string[];
                    seriesId?: number;
                    seasonNumber?: number;
                    filterExistingFiles?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ManualImportResource"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ManualImportReprocessResource"][];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["ManualImportResource"][];
                        "application/json": components["schemas"]["ManualImportResource"][];
                        "text/json": components["schemas"]["ManualImportResource"][];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/wanted/missing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    page?: number;
                    pageSize?: number;
                    sortKey?: string;
                    sortDirection?: components["schemas"]["SortDirection"];
                    monitored?: boolean;
                    includeSubresources?: components["schemas"]["MissingSubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EpisodeResourcePagingResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/wanted/missing/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EpisodeResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/settings/naming": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["NamingSettingsResource"];
                        "application/json": components["schemas"]["NamingSettingsResource"];
                        "text/json": components["schemas"]["NamingSettingsResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/settings/naming/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["NamingSettingsResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["NamingSettingsResource"];
                    "text/json": components["schemas"]["NamingSettingsResource"];
                    "application/*+json": components["schemas"]["NamingSettingsResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["NamingSettingsResource"];
                        "application/json": components["schemas"]["NamingSettingsResource"];
                        "text/json": components["schemas"]["NamingSettingsResource"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/settings/naming/examples": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    renameEpisodes?: boolean;
                    replaceIllegalCharacters?: boolean;
                    colonReplacementFormat?: number;
                    customColonReplacementFormat?: string;
                    multiEpisodeStyle?: number;
                    standardEpisodeFormat?: string;
                    dailyEpisodeFormat?: string;
                    animeEpisodeFormat?: string;
                    seriesFolderFormat?: string;
                    seasonFolderFormat?: string;
                    specialsFolderFormat?: string;
                    id?: number;
                    resourceName?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/parse": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    title?: string;
                    path?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ParseResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ping": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PingResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PingResource"];
                    };
                };
            };
        };
        patch?: never;
        trace?: never;
    };
    "/api/v5/qualitydefinition/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["QualityDefinitionResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["QualityDefinitionResource"];
                    "text/json": components["schemas"]["QualityDefinitionResource"];
                    "application/*+json": components["schemas"]["QualityDefinitionResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["QualityDefinitionResource"];
                        "application/json": components["schemas"]["QualityDefinitionResource"];
                        "text/json": components["schemas"]["QualityDefinitionResource"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/qualitydefinition": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["QualityDefinitionResource"][];
                        "application/json": components["schemas"]["QualityDefinitionResource"][];
                        "text/json": components["schemas"]["QualityDefinitionResource"][];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["QualityDefinitionResource"][];
                    "text/json": components["schemas"]["QualityDefinitionResource"][];
                    "application/*+json": components["schemas"]["QualityDefinitionResource"][];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/qualityprofile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["QualityProfileResource"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["QualityProfileResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["QualityProfileResource"];
                        "application/json": components["schemas"]["QualityProfileResource"];
                        "text/json": components["schemas"]["QualityProfileResource"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/qualityprofile/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["QualityProfileResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["QualityProfileResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["QualityProfileResource"];
                        "application/json": components["schemas"]["QualityProfileResource"];
                        "text/json": components["schemas"]["QualityProfileResource"];
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/qualityprofile/schema": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["QualityProfileResource"];
                        "application/json": components["schemas"]["QualityProfileResource"];
                        "text/json": components["schemas"]["QualityProfileResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/queue/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: {
                    message?: string;
                    removeFromClient?: boolean;
                    blocklist?: boolean;
                    skipRedownload?: boolean;
                    changeCategory?: boolean;
                };
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/queue/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: {
                    message?: string;
                    removeFromClient?: boolean;
                    blocklist?: boolean;
                    skipRedownload?: boolean;
                    changeCategory?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["QueueBulkResource"];
                    "text/json": components["schemas"]["QueueBulkResource"];
                    "application/*+json": components["schemas"]["QueueBulkResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/queue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    page?: number;
                    pageSize?: number;
                    sortKey?: string;
                    sortDirection?: components["schemas"]["SortDirection"];
                    includeUnknownSeriesItems?: boolean;
                    seriesIds?: number[];
                    protocol?: components["schemas"]["DownloadProtocol"];
                    languages?: number[];
                    quality?: number[];
                    status?: components["schemas"]["QueueStatus"][];
                    includeSubresources?: components["schemas"]["QueueSubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["QueueResourcePagingResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/queue/grab/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/queue/grab/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["QueueBulkResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/queue/details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    seriesId?: number;
                    episodeIds?: number[];
                    includeSubresources?: components["schemas"]["QueueSubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["QueueResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/queue/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["QueueStatusResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    seriesId?: number;
                    episodeId?: number;
                    seasonNumber?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ReleaseResource"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ReleaseGrabResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/releaseprofile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["ReleaseProfileResource"][];
                        "application/json": components["schemas"]["ReleaseProfileResource"][];
                        "text/json": components["schemas"]["ReleaseProfileResource"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ReleaseProfileResource"];
                    "text/json": components["schemas"]["ReleaseProfileResource"];
                    "application/*+json": components["schemas"]["ReleaseProfileResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["ReleaseProfileResource"];
                        "application/json": components["schemas"]["ReleaseProfileResource"];
                        "text/json": components["schemas"]["ReleaseProfileResource"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/releaseprofile/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ReleaseProfileResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ReleaseProfileResource"];
                    "text/json": components["schemas"]["ReleaseProfileResource"];
                    "application/*+json": components["schemas"]["ReleaseProfileResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["ReleaseProfileResource"];
                        "application/json": components["schemas"]["ReleaseProfileResource"];
                        "text/json": components["schemas"]["ReleaseProfileResource"];
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/release/push": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ReleasePushResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["ReleaseResource"];
                        "application/json": components["schemas"]["ReleaseResource"];
                        "text/json": components["schemas"]["ReleaseResource"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/release/push/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ReleasePushResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/remotepathmapping": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RemotePathMappingResource"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["RemotePathMappingResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["RemotePathMappingResource"];
                        "application/json": components["schemas"]["RemotePathMappingResource"];
                        "text/json": components["schemas"]["RemotePathMappingResource"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/remotepathmapping/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RemotePathMappingResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["RemotePathMappingResource"];
                    "text/json": components["schemas"]["RemotePathMappingResource"];
                    "application/*+json": components["schemas"]["RemotePathMappingResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["RemotePathMappingResource"];
                        "application/json": components["schemas"]["RemotePathMappingResource"];
                        "text/json": components["schemas"]["RemotePathMappingResource"];
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/rename": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    seriesId?: number;
                    seasonNumber?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RenameEpisodeResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/rename/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    seriesIds?: number[];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RenameEpisodeResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/rootfolder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RootFolderResource"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["RootFolderResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["RootFolderResource"];
                        "application/json": components["schemas"]["RootFolderResource"];
                        "text/json": components["schemas"]["RootFolderResource"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/rootfolder/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RootFolderResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/seasonpass": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["SeasonPassResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/series": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    tvdbId?: number;
                    includeSubresources?: components["schemas"]["SeriesSubresource"][];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SeriesResource"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["SeriesResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SeriesResource"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/series/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    includeSubresources?: components["schemas"]["SeriesSubresource"][];
                };
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SeriesResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: {
                    moveFiles?: boolean;
                };
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["SeriesResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SeriesResource"];
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: {
                    deleteFiles?: boolean;
                    addImportListExclusion?: boolean;
                };
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/series/{id}/season": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["SeasonResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SeasonResource"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/series/editor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["SeriesEditorResource"];
                    "text/json": components["schemas"]["SeriesEditorResource"];
                    "application/*+json": components["schemas"]["SeriesEditorResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["SeriesEditorResource"];
                    "text/json": components["schemas"]["SeriesEditorResource"];
                    "application/*+json": components["schemas"]["SeriesEditorResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/series/{id}/folder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/series/import": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["SeriesResource"][];
                    "text/json": components["schemas"]["SeriesResource"][];
                    "application/*+json": components["schemas"]["SeriesResource"][];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/series/lookup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    term?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["SeriesResource"][];
                        "application/json": components["schemas"]["SeriesResource"][];
                        "text/json": components["schemas"]["SeriesResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/content/{path}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    path: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    path: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/{path}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    path: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/system/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SystemResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/system/routes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/system/routes/duplicate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/system/shutdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/system/restart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/tag": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TagResource"][];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["TagResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["TagResource"];
                        "application/json": components["schemas"]["TagResource"];
                        "text/json": components["schemas"]["TagResource"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/tag/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TagResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["TagResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["TagResource"];
                        "application/json": components["schemas"]["TagResource"];
                        "text/json": components["schemas"]["TagResource"];
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/tag/detail": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TagDetailsResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/tag/detail/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TagDetailsResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/system/task": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TaskResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/system/task/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TaskResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/settings/ui/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UiSettingsResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["UiSettingsResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["UiSettingsResource"];
                        "application/json": components["schemas"]["UiSettingsResource"];
                        "text/json": components["schemas"]["UiSettingsResource"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/settings/ui": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UiSettingsResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UpdateResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/log/file/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LogFileResource"][];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/log/file/update/{filename}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    filename: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/settings/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["UpdateSettingsResource"];
                        "application/json": components["schemas"]["UpdateSettingsResource"];
                        "text/json": components["schemas"]["UpdateSettingsResource"];
                    };
                };
            };
        };
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["UpdateSettingsResource"];
                    "text/json": components["schemas"]["UpdateSettingsResource"];
                    "application/*+json": components["schemas"]["UpdateSettingsResource"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": components["schemas"]["UpdateSettingsResource"];
                        "application/json": components["schemas"]["UpdateSettingsResource"];
                        "text/json": components["schemas"]["UpdateSettingsResource"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v5/settings/update/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UpdateSettingsResource"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AddSeriesOptions: {
            ignoreEpisodesWithFiles?: boolean;
            ignoreEpisodesWithoutFiles?: boolean;
            monitor?: components["schemas"]["MonitorTypes"];
            searchForMissingEpisodes?: boolean;
            searchForCutoffUnmetEpisodes?: boolean;
        };
        AlternateTitleResource: {
            title?: string | null;
            /** Format: int32 */
            seasonNumber?: number | null;
            /** Format: int32 */
            sceneSeasonNumber?: number | null;
            sceneOrigin?: string | null;
            comment?: string | null;
        };
        /** @enum {string} */
        ApplyTags: "add" | "remove" | "replace";
        /** @enum {string} */
        AuthenticationType: "none" | "basic" | "forms" | "external";
        BackupResource: {
            /** Format: int32 */
            id?: number;
            name: string | null;
            path: string | null;
            type?: components["schemas"]["BackupType"];
            /** Format: int64 */
            size?: number;
            /** Format: date-time */
            time?: string;
        };
        /** @enum {string} */
        BackupType: "scheduled" | "manual" | "update";
        BlocklistBulkResource: {
            ids: number[] | null;
        };
        BlocklistResource: {
            /** Format: int32 */
            id?: number;
            /** Format: int32 */
            seriesId?: number;
            episodeIds: number[] | null;
            sourceTitle: string | null;
            languages: components["schemas"]["Language"][] | null;
            quality: components["schemas"]["QualityModel"];
            customFormats: components["schemas"]["CustomFormatResource"][] | null;
            /** Format: date-time */
            date?: string;
            protocol?: components["schemas"]["DownloadProtocol"];
            indexer?: string | null;
            message?: string | null;
            source?: string | null;
            series: components["schemas"]["SeriesResource"];
        };
        BlocklistResourcePagingResource: {
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            pageSize?: number;
            sortKey?: string | null;
            sortDirection?: components["schemas"]["SortDirection"];
            /** Format: int32 */
            totalRecords?: number;
            records?: components["schemas"]["BlocklistResource"][] | null;
        };
        /** @enum {string} */
        CalendarSubresource: "series" | "episodeFile" | "images";
        Command: {
            sendUpdatesToClient?: boolean;
            readonly updateScheduledTask?: boolean;
            readonly completionMessage?: string | null;
            readonly requiresDiskAccess?: boolean;
            readonly isExclusive?: boolean;
            readonly isLongRunning?: boolean;
            readonly name?: string | null;
            /** Format: date-time */
            lastExecutionTime?: string | null;
            /** Format: date-time */
            lastStartTime?: string | null;
            trigger?: components["schemas"]["CommandTrigger"];
            suppressMessages?: boolean;
            clientUserAgent?: string | null;
        };
        /** @enum {string} */
        CommandPriority: "normal" | "high" | "low";
        CommandResource: {
            /** Format: int32 */
            id?: number;
            name?: string | null;
            commandName?: string | null;
            message?: string | null;
            body?: components["schemas"]["Command"];
            priority?: components["schemas"]["CommandPriority"];
            status?: components["schemas"]["CommandStatus"];
            result?: components["schemas"]["CommandResult"];
            /** Format: date-time */
            queued?: string;
            /** Format: date-time */
            started?: string | null;
            /** Format: date-time */
            ended?: string | null;
            /** Format: date-span */
            duration?: string | null;
            exception?: string | null;
            trigger?: components["schemas"]["CommandTrigger"];
            clientUserAgent?: string | null;
            /** Format: date-time */
            stateChangeTime?: string | null;
            sendUpdatesToClient?: boolean;
            updateScheduledTask?: boolean;
            /** Format: date-time */
            lastExecutionTime?: string | null;
        };
        /** @enum {string} */
        CommandResult: "unknown" | "successful" | "unsuccessful" | "indeterminate";
        /** @enum {string} */
        CommandStatus: "queued" | "started" | "completed" | "failed" | "aborted" | "cancelled" | "orphaned";
        /** @enum {string} */
        CommandTrigger: "unspecified" | "manual" | "scheduled";
        ConnectionResource: {
            /** Format: int32 */
            id?: number;
            name?: string | null;
            fields?: components["schemas"]["Field"][] | null;
            implementationName?: string | null;
            implementation?: string | null;
            configContract?: string | null;
            infoLink?: string | null;
            message?: components["schemas"]["ProviderMessage"];
            tags?: number[] | null;
            presets?: components["schemas"]["ConnectionResource"][] | null;
            link?: string | null;
            onGrab?: boolean;
            onDownload?: boolean;
            onUpgrade?: boolean;
            onImportComplete?: boolean;
            onRename?: boolean;
            onSeriesAdd?: boolean;
            onSeriesDelete?: boolean;
            onEpisodeFileDelete?: boolean;
            onEpisodeFileDeleteForUpgrade?: boolean;
            onHealthIssue?: boolean;
            includeHealthWarnings?: boolean;
            onHealthRestored?: boolean;
            onApplicationUpdate?: boolean;
            onManualInteractionRequired?: boolean;
            supportsOnGrab?: boolean;
            supportsOnDownload?: boolean;
            supportsOnUpgrade?: boolean;
            supportsOnImportComplete?: boolean;
            supportsOnRename?: boolean;
            supportsOnSeriesAdd?: boolean;
            supportsOnSeriesDelete?: boolean;
            supportsOnEpisodeFileDelete?: boolean;
            supportsOnEpisodeFileDeleteForUpgrade?: boolean;
            supportsOnHealthIssue?: boolean;
            supportsOnHealthRestored?: boolean;
            supportsOnApplicationUpdate?: boolean;
            supportsOnManualInteractionRequired?: boolean;
            testCommand?: string | null;
        };
        CustomFilterResource: {
            /** Format: int32 */
            id?: number;
            type?: string | null;
            label?: string | null;
            filters?: {
                [key: string]: unknown;
            }[] | null;
        };
        CustomFormatResource: {
            /** Format: int32 */
            id?: number;
            name: string | null;
            includeCustomFormatWhenRenaming?: boolean | null;
            specifications?: components["schemas"]["CustomFormatSpecificationSchema"][] | null;
        };
        CustomFormatSpecificationSchema: {
            /** Format: int32 */
            id?: number;
            name: string | null;
            implementation: string | null;
            implementationName: string | null;
            infoLink: string | null;
            negate?: boolean;
            required?: boolean;
            fields: components["schemas"]["Field"][] | null;
            presets?: components["schemas"]["CustomFormatSpecificationSchema"][] | null;
        };
        /** @enum {string} */
        CutoffSubresource: "series" | "episodeFile" | "images";
        /** @enum {string} */
        DatabaseType: "sqLite" | "postgreSQL";
        DiskSpaceResource: {
            /** Format: int32 */
            id?: number;
            path: string | null;
            label: string | null;
            /** Format: int64 */
            freeSpace?: number;
            /** Format: int64 */
            totalSpace?: number;
        };
        /** @enum {string} */
        DownloadProtocol: "unknown" | "usenet" | "torrent";
        /** @enum {string} */
        DownloadRejectionReason: "unknown" | "unknownSeries" | "unknownEpisode" | "matchesAnotherSeries" | "unableToParse" | "error" | "decisionError" | "minimumAgeDelay" | "minimumAgeDelayPushed" | "seriesNotMonitored" | "episodeNotMonitored" | "historyRecentCutoffMet" | "historyCdhDisabledCutoffMet" | "historyHigherPreference" | "historyHigherRevision" | "historyCutoffMet" | "historyCustomFormatCutoffMet" | "historyCustomFormatScore" | "historyCustomFormatScoreIncrement" | "historyUpgradesNotAllowed" | "noMatchingTag" | "propersDisabled" | "properForOldFile" | "wrongEpisode" | "wrongSeason" | "wrongSeries" | "fullSeason" | "unknownRuntime" | "belowMinimumSize" | "aboveMaximumSize" | "alreadyImportedSameHash" | "alreadyImportedSameName" | "unknownReleaseGroup" | "releaseGroupDoesNotMatch" | "indexerDisabled" | "blocklisted" | "customFormatMinimumScore" | "minimumFreeSpace" | "fullSeasonNotAired" | "maximumSizeExceeded" | "minimumAge" | "maximumAge" | "multiSeason" | "sample" | "protocolDisabled" | "qualityNotWanted" | "qualityUpgradesDisabled" | "queueHigherPreference" | "queueHigherRevision" | "queueCutoffMet" | "queueCustomFormatCutoffMet" | "queueCustomFormatScore" | "queueCustomFormatScoreIncrement" | "queueUpgradesNotAllowed" | "queuePropersDisabled" | "raw" | "mustContainMissing" | "mustNotContainPresent" | "repackDisabled" | "repackUnknownReleaseGroup" | "repackReleaseGroupDoesNotMatch" | "existingFileHasMoreEpisodes" | "ambiguousNumbering" | "notSeasonPack" | "splitEpisode" | "minimumSeeders" | "diskHigherPreference" | "diskHigherRevision" | "diskCutoffMet" | "diskCustomFormatCutoffMet" | "diskCustomFormatScore" | "diskCustomFormatScoreIncrement" | "diskUpgradesNotAllowed" | "diskNotUpgrade";
        DownloadRejectionResource: {
            message?: string | null;
            reason?: components["schemas"]["DownloadRejectionReason"];
            type?: components["schemas"]["RejectionType"];
        };
        EpisodeFileListResource: {
            episodeFileIds?: number[] | null;
        };
        EpisodeFileResource: {
            /** Format: int32 */
            id?: number;
            /** Format: int32 */
            seriesId?: number;
            /** Format: int32 */
            seasonNumber?: number;
            relativePath?: string | null;
            path?: string | null;
            /** Format: int64 */
            size?: number;
            /** Format: date-time */
            dateAdded?: string;
            sceneName?: string | null;
            releaseGroup?: string | null;
            languages?: components["schemas"]["Language"][] | null;
            quality?: components["schemas"]["QualityModel"];
            customFormats?: components["schemas"]["CustomFormatResource"][] | null;
            /** Format: int32 */
            customFormatScore?: number;
            /** Format: int32 */
            indexerFlags?: number | null;
            releaseType?: components["schemas"]["ReleaseType"];
            mediaInfo?: components["schemas"]["MediaInfoResource"];
            qualityCutoffNotMet?: boolean;
        };
        /** @enum {string} */
        EpisodeHistoryEventType: "unknown" | "grabbed" | "seriesFolderImported" | "downloadFolderImported" | "downloadFailed" | "episodeFileDeleted" | "episodeFileRenamed" | "downloadIgnored";
        EpisodeResource: {
            /** Format: int32 */
            id?: number;
            /** Format: int32 */
            seriesId?: number;
            /** Format: int32 */
            tvdbId?: number;
            /** Format: int32 */
            episodeFileId?: number;
            /** Format: int32 */
            seasonNumber?: number;
            /** Format: int32 */
            episodeNumber?: number;
            title?: string | null;
            airDate?: string | null;
            /** Format: date-time */
            airDateUtc?: string | null;
            /** Format: date-time */
            lastSearchTime?: string | null;
            /** Format: int32 */
            runtime?: number;
            finaleType?: string | null;
            overview?: string | null;
            episodeFile?: components["schemas"]["EpisodeFileResource"];
            hasFile?: boolean;
            monitored?: boolean;
            /** Format: int32 */
            absoluteEpisodeNumber?: number | null;
            /** Format: int32 */
            sceneAbsoluteEpisodeNumber?: number | null;
            /** Format: int32 */
            sceneEpisodeNumber?: number | null;
            /** Format: int32 */
            sceneSeasonNumber?: number | null;
            unverifiedSceneNumbering?: boolean;
            /** Format: date-time */
            endTime?: string | null;
            /** Format: date-time */
            grabDate?: string | null;
            series?: components["schemas"]["SeriesResource"];
            images?: components["schemas"]["MediaCover"][] | null;
        };
        EpisodeResourcePagingResource: {
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            pageSize?: number;
            sortKey?: string | null;
            sortDirection?: components["schemas"]["SortDirection"];
            /** Format: int32 */
            totalRecords?: number;
            records?: components["schemas"]["EpisodeResource"][] | null;
        };
        /** @enum {string} */
        EpisodeSubresource: "series" | "episodeFile" | "images";
        EpisodesMonitoredResource: {
            episodeIds: number[] | null;
            monitored?: boolean;
        };
        Field: {
            /** Format: int32 */
            order?: number;
            name?: string | null;
            label?: string | null;
            unit?: string | null;
            helpText?: string | null;
            helpTextWarning?: string | null;
            helpLink?: string | null;
            value?: unknown;
            type?: string | null;
            advanced?: boolean;
            selectOptions?: components["schemas"]["SelectOption"][] | null;
            selectOptionsProviderAction?: string | null;
            section?: string | null;
            hidden?: string | null;
            privacy?: components["schemas"]["PrivacyLevel"];
            placeholder?: string | null;
            isFloat?: boolean;
        };
        /** @enum {string} */
        HealthCheckReason: "appDataLocation" | "downloadClientCheckNoneAvailable" | "downloadClientCheckUnableToCommunicate" | "downloadClientRemovesCompletedDownloads" | "downloadClientRootFolder" | "downloadClientSorting" | "downloadClientStatusAllClients" | "downloadClientStatusSingleClient" | "importListRootFolderMissing" | "importListRootFolderMultipleMissing" | "importListStatusAllUnavailable" | "importListStatusUnavailable" | "importMechanismEnableCompletedDownloadHandlingIfPossible" | "importMechanismEnableCompletedDownloadHandlingIfPossibleMultiComputer" | "importMechanismHandlingDisabled" | "indexerDownloadClient" | "indexerJackettAll" | "indexerLongTermStatusAllUnavailable" | "indexerLongTermStatusUnavailable" | "indexerRssNoIndexersAvailable" | "indexerRssNoIndexersEnabled" | "indexerSearchNoAutomatic" | "indexerSearchNoAvailableIndexers" | "indexerSearchNoInteractive" | "indexerStatusAllUnavailable" | "indexerStatusUnavailable" | "minimumApiKeyLength" | "mountSeries" | "notificationStatusAll" | "notificationStatusSingle" | "package" | "proxyBadRequest" | "proxyFailed" | "proxyResolveIp" | "recycleBinUnableToWrite" | "remotePathMappingBadDockerPath" | "remotePathMappingDockerFolderMissing" | "remotePathMappingDownloadPermissionsEpisode" | "remotePathMappingFileRemoved" | "remotePathMappingFilesBadDockerPath" | "remotePathMappingFilesGenericPermissions" | "remotePathMappingFilesLocalWrongOSPath" | "remotePathMappingFilesWrongOSPath" | "remotePathMappingFolderPermissions" | "remotePathMappingGenericPermissions" | "remotePathMappingImportEpisodeFailed" | "remotePathMappingLocalFolderMissing" | "remotePathMappingLocalWrongOSPath" | "remotePathMappingRemoteDownloadClient" | "remotePathMappingWrongOSPath" | "removedSeriesMultiple" | "removedSeriesSingle" | "rootFolderEmpty" | "rootFolderMissing" | "rootFolderMultipleMissing" | "serverNotification" | "systemTime" | "updateAvailable" | "updateStartupNotWritable" | "updateStartupTranslocation" | "updateUiNotWritable";
        /** @enum {string} */
        HealthCheckResult: "ok" | "notice" | "warning" | "error";
        HealthResource: {
            /** Format: int32 */
            id?: number;
            source?: string | null;
            type?: components["schemas"]["HealthCheckResult"];
            reason?: components["schemas"]["HealthCheckReason"];
            message?: string | null;
            wikiUrl?: string | null;
        };
        HistoryResource: {
            /** Format: int32 */
            id?: number;
            /** Format: int32 */
            episodeId?: number;
            /** Format: int32 */
            seriesId?: number;
            sourceTitle: string | null;
            languages: components["schemas"]["Language"][] | null;
            quality: components["schemas"]["QualityModel"];
            customFormats: components["schemas"]["CustomFormatResource"][] | null;
            /** Format: int32 */
            customFormatScore?: number;
            qualityCutoffNotMet?: boolean;
            /** Format: date-time */
            date?: string;
            downloadId?: string | null;
            eventType?: components["schemas"]["EpisodeHistoryEventType"];
            data: {
                [key: string]: string;
            } | null;
            episode?: components["schemas"]["EpisodeResource"];
            series?: components["schemas"]["SeriesResource"];
        };
        HistoryResourcePagingResource: {
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            pageSize?: number;
            sortKey?: string | null;
            sortDirection?: components["schemas"]["SortDirection"];
            /** Format: int32 */
            totalRecords?: number;
            records?: components["schemas"]["HistoryResource"][] | null;
        };
        /** @enum {string} */
        HistorySubresource: "series" | "episode";
        /** @enum {string} */
        ImportRejectionReason: "unknown" | "fileLocked" | "unknownSeries" | "dangerousFile" | "executableFile" | "userRejectedExtension" | "archiveFile" | "seriesFolder" | "invalidFilePath" | "unsupportedExtension" | "partialSeason" | "seasonExtra" | "invalidSeasonOrEpisode" | "unableToParse" | "error" | "decisionError" | "noEpisodes" | "missingAbsoluteEpisodeNumber" | "episodeAlreadyImported" | "titleMissing" | "titleTba" | "minimumFreeSpace" | "fullSeason" | "noAudio" | "episodeUnexpected" | "episodeNotFoundInRelease" | "sample" | "sampleIndeterminate" | "unpacking" | "existingFileHasMoreEpisodes" | "splitEpisode" | "unverifiedSceneMapping" | "notQualityUpgrade" | "notRevisionUpgrade" | "notCustomFormatUpgrade";
        ImportRejectionResource: {
            reason?: components["schemas"]["ImportRejectionReason"];
            message?: string | null;
            type?: components["schemas"]["RejectionType"];
        };
        Language: {
            /** Format: int32 */
            id?: number;
            name?: string | null;
        };
        LocalizationLanguageResource: {
            identifier?: string | null;
        };
        LocalizationResource: {
            /** Format: int32 */
            id?: number;
            strings?: {
                [key: string]: string;
            } | null;
        };
        LogFileResource: {
            /** Format: int32 */
            id?: number;
            filename: string | null;
            /** Format: date-time */
            lastWriteTime: string;
            contentsUrl: string | null;
            downloadUrl: string | null;
        };
        LogResource: {
            /** Format: int32 */
            id?: number;
            /** Format: date-time */
            time?: string;
            exception?: string | null;
            exceptionType?: string | null;
            level: string | null;
            logger: string | null;
            message: string | null;
        };
        LogResourcePagingResource: {
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            pageSize?: number;
            sortKey?: string | null;
            sortDirection?: components["schemas"]["SortDirection"];
            /** Format: int32 */
            totalRecords?: number;
            records?: components["schemas"]["LogResource"][] | null;
        };
        ManualImportReprocessResource: {
            /** Format: int32 */
            id?: number;
            path?: string | null;
            /** Format: int32 */
            seriesId?: number;
            /** Format: int32 */
            seasonNumber?: number | null;
            episodes?: components["schemas"]["EpisodeResource"][] | null;
            episodeIds?: number[] | null;
            quality?: components["schemas"]["QualityModel"];
            languages?: components["schemas"]["Language"][] | null;
            releaseGroup?: string | null;
            downloadId?: string | null;
            customFormats?: components["schemas"]["CustomFormatResource"][] | null;
            /** Format: int32 */
            customFormatScore?: number;
            /** Format: int32 */
            indexerFlags?: number;
            releaseType?: components["schemas"]["ReleaseType"];
            rejections?: components["schemas"]["ImportRejectionResource"][] | null;
        };
        ManualImportResource: {
            /** Format: int32 */
            id?: number;
            path?: string | null;
            relativePath?: string | null;
            folderName?: string | null;
            name?: string | null;
            /** Format: int64 */
            size?: number;
            series?: components["schemas"]["SeriesResource"];
            /** Format: int32 */
            seasonNumber?: number | null;
            episodes?: components["schemas"]["EpisodeResource"][] | null;
            /** Format: int32 */
            episodeFileId?: number | null;
            releaseGroup?: string | null;
            quality?: components["schemas"]["QualityModel"];
            languages?: components["schemas"]["Language"][] | null;
            /** Format: int32 */
            qualityWeight?: number;
            downloadId?: string | null;
            customFormats?: components["schemas"]["CustomFormatResource"][] | null;
            /** Format: int32 */
            customFormatScore?: number;
            /** Format: int32 */
            indexerFlags?: number;
            releaseType?: components["schemas"]["ReleaseType"];
            rejections?: components["schemas"]["ImportRejectionResource"][] | null;
        };
        MediaCover: {
            coverType?: components["schemas"]["MediaCoverTypes"];
            url?: string | null;
            remoteUrl?: string | null;
        };
        /** @enum {string} */
        MediaCoverTypes: "unknown" | "poster" | "banner" | "fanart" | "screenshot" | "headshot" | "clearlogo";
        MediaInfoAudioStreamResource: {
            language?: string | null;
            codec?: string | null;
            codecId?: string | null;
            profile?: string | null;
            /** Format: int64 */
            bitrate?: number;
            /** Format: double */
            channels?: number;
            channelPositions?: string | null;
            title?: string | null;
        };
        MediaInfoResource: {
            /** Format: int32 */
            id?: number;
            /** Format: int32 */
            videoBitDepth?: number;
            /** Format: int64 */
            videoBitrate?: number;
            videoCodec?: string | null;
            /** Format: double */
            videoFps?: number;
            videoDynamicRange?: string | null;
            videoDynamicRangeType?: string | null;
            resolution?: string | null;
            runTime?: string | null;
            scanType?: string | null;
            audioStreams?: components["schemas"]["MediaInfoAudioStreamResource"][] | null;
            subtitleStreams?: components["schemas"]["MediaInfoSubtitleStreamResource"][] | null;
        };
        MediaInfoSubtitleStreamResource: {
            language?: string | null;
            format?: string | null;
            title?: string | null;
            forced?: boolean | null;
            hearingImpaired?: boolean | null;
        };
        /** @enum {string} */
        MissingSubresource: "series" | "images";
        /** @enum {string} */
        MonitorTypes: "unknown" | "all" | "future" | "missing" | "existing" | "firstSeason" | "lastSeason" | "latestSeason" | "pilot" | "recent" | "monitorSpecials" | "unmonitorSpecials" | "none" | "skip";
        MonitoringOptionsResource: {
            monitor?: components["schemas"]["MonitorTypes"];
        };
        NamingSettingsResource: {
            /** Format: int32 */
            id?: number;
            renameEpisodes?: boolean;
            replaceIllegalCharacters?: boolean;
            /** Format: int32 */
            colonReplacementFormat?: number;
            customColonReplacementFormat?: string | null;
            /** Format: int32 */
            multiEpisodeStyle?: number;
            standardEpisodeFormat?: string | null;
            dailyEpisodeFormat?: string | null;
            animeEpisodeFormat?: string | null;
            seriesFolderFormat?: string | null;
            seasonFolderFormat?: string | null;
            specialsFolderFormat?: string | null;
        };
        /** @enum {string} */
        NewItemMonitorTypes: "all" | "none";
        OverrideReleaseResource: {
            /** Format: int32 */
            seriesId?: number | null;
            episodeIds?: number[] | null;
            /** Format: int32 */
            downloadClientId?: number | null;
            quality?: components["schemas"]["QualityModel"];
            languages?: components["schemas"]["Language"][] | null;
        };
        ParseResource: {
            /** Format: int32 */
            id?: number;
            title?: string | null;
            parsedEpisodeInfo?: components["schemas"]["ParsedEpisodeInfo"];
            series?: components["schemas"]["SeriesResource"];
            episodes?: components["schemas"]["EpisodeResource"][] | null;
            languages?: components["schemas"]["Language"][] | null;
            customFormats?: components["schemas"]["CustomFormatResource"][] | null;
            /** Format: int32 */
            customFormatScore?: number;
        };
        ParsedEpisodeInfo: {
            releaseTitle?: string | null;
            seriesTitle?: string | null;
            seriesTitleInfo?: components["schemas"]["SeriesTitleInfo"];
            quality?: components["schemas"]["QualityModel"];
            /** Format: int32 */
            seasonNumber?: number;
            episodeNumbers?: number[] | null;
            absoluteEpisodeNumbers?: number[] | null;
            specialAbsoluteEpisodeNumbers?: number[] | null;
            airDate?: string | null;
            languages?: components["schemas"]["Language"][] | null;
            fullSeason?: boolean;
            isPartialSeason?: boolean;
            isMultiSeason?: boolean;
            isSeasonExtra?: boolean;
            isSplitEpisode?: boolean;
            isMiniSeries?: boolean;
            special?: boolean;
            releaseGroup?: string | null;
            releaseHash?: string | null;
            /** Format: int32 */
            seasonPart?: number;
            releaseTokens?: string | null;
            /** Format: int32 */
            dailyPart?: number | null;
            readonly isDaily?: boolean;
            readonly isAbsoluteNumbering?: boolean;
            readonly isPossibleSpecialEpisode?: boolean;
            readonly isPossibleSceneSeasonSpecial?: boolean;
            releaseType?: components["schemas"]["ReleaseType"];
        };
        ParsedEpisodeInfoResource: {
            quality?: components["schemas"]["QualityModel"];
            releaseGroup?: string | null;
            releaseHash?: string | null;
            fullSeason?: boolean;
            /** Format: int32 */
            seasonNumber?: number;
            airDate?: string | null;
            seriesTitle?: string | null;
            episodeNumbers?: number[] | null;
            absoluteEpisodeNumbers?: number[] | null;
            isDaily?: boolean;
            isAbsoluteNumbering?: boolean;
            isPossibleSpecialEpisode?: boolean;
            special?: boolean;
        };
        PingResource: {
            status?: string | null;
        };
        /** @enum {string} */
        PrivacyLevel: "normal" | "password" | "apiKey" | "userName";
        ProfileFormatItemResource: {
            /** Format: int32 */
            id?: number;
            /** Format: int32 */
            format?: number;
            name?: string | null;
            /** Format: int32 */
            score?: number;
        };
        ProviderMessage: {
            message?: string | null;
            type?: components["schemas"]["ProviderMessageType"];
        };
        /** @enum {string} */
        ProviderMessageType: "info" | "warning" | "error";
        Quality: {
            /** Format: int32 */
            id?: number;
            name?: string | null;
            source?: components["schemas"]["QualitySource"];
            /** Format: int32 */
            resolution?: number;
        };
        QualityDefinitionResource: {
            /** Format: int32 */
            id?: number;
            quality?: components["schemas"]["Quality"];
            title?: string | null;
            /** Format: int32 */
            weight?: number;
        };
        QualityModel: {
            quality?: components["schemas"]["Quality"];
            revision?: components["schemas"]["Revision"];
        };
        QualityProfileQualityItemResource: {
            /** Format: int32 */
            id?: number;
            name?: string | null;
            quality?: components["schemas"]["Quality"];
            items?: components["schemas"]["QualityProfileQualityItemResource"][] | null;
            allowed?: boolean;
            /** Format: double */
            minSize?: number | null;
            /** Format: double */
            maxSize?: number | null;
            /** Format: double */
            preferredSize?: number | null;
        };
        QualityProfileResource: {
            /** Format: int32 */
            id?: number;
            name?: string | null;
            upgradeAllowed?: boolean;
            /** Format: int32 */
            cutoff?: number;
            items?: components["schemas"]["QualityProfileQualityItemResource"][] | null;
            /** Format: int32 */
            minFormatScore?: number;
            /** Format: int32 */
            cutoffFormatScore?: number;
            /** Format: int32 */
            minUpgradeFormatScore?: number;
            formatItems?: components["schemas"]["ProfileFormatItemResource"][] | null;
        };
        /** @enum {string} */
        QualitySource: "unknown" | "television" | "televisionRaw" | "web" | "webRip" | "dvd" | "bluray" | "blurayRaw";
        QueueBulkResource: {
            ids: number[] | null;
        };
        QueueResource: {
            /** Format: int32 */
            id?: number;
            /** Format: int32 */
            seriesId?: number | null;
            episodeIds?: number[] | null;
            seasonNumbers?: number[] | null;
            series?: components["schemas"]["SeriesResource"];
            episodes?: components["schemas"]["EpisodeResource"][] | null;
            languages?: components["schemas"]["Language"][] | null;
            quality?: components["schemas"]["QualityModel"];
            customFormats?: components["schemas"]["CustomFormatResource"][] | null;
            /** Format: int32 */
            customFormatScore?: number;
            /** Format: double */
            size?: number;
            title?: string | null;
            /** Format: double */
            sizeLeft?: number;
            /** Format: date-span */
            timeLeft?: string | null;
            /** Format: date-time */
            estimatedCompletionTime?: string | null;
            /** Format: date-time */
            added?: string | null;
            status?: components["schemas"]["QueueStatus"];
            trackedDownloadStatus?: components["schemas"]["TrackedDownloadStatus"];
            trackedDownloadState?: components["schemas"]["TrackedDownloadState"];
            statusMessages?: components["schemas"]["TrackedDownloadStatusMessage"][] | null;
            errorMessage?: string | null;
            downloadId?: string | null;
            protocol?: components["schemas"]["DownloadProtocol"];
            downloadClient?: string | null;
            downloadClientHasPostImportCategory?: boolean;
            indexer?: string | null;
            outputPath?: string | null;
            /** Format: int32 */
            episodesWithFilesCount?: number;
            isFullSeason?: boolean;
        };
        QueueResourcePagingResource: {
            /** Format: int32 */
            page?: number;
            /** Format: int32 */
            pageSize?: number;
            sortKey?: string | null;
            sortDirection?: components["schemas"]["SortDirection"];
            /** Format: int32 */
            totalRecords?: number;
            records?: components["schemas"]["QueueResource"][] | null;
        };
        /** @enum {string} */
        QueueStatus: "unknown" | "queued" | "paused" | "downloading" | "completed" | "failed" | "warning" | "delay" | "downloadClientUnavailable" | "fallback";
        QueueStatusResource: {
            /** Format: int32 */
            id?: number;
            /** Format: int32 */
            totalCount?: number;
            /** Format: int32 */
            count?: number;
            /** Format: int32 */
            unknownCount?: number;
            errors?: boolean;
            warnings?: boolean;
            unknownErrors?: boolean;
            unknownWarnings?: boolean;
        };
        /** @enum {string} */
        QueueSubresource: "series" | "episodes";
        Ratings: {
            /** Format: int32 */
            votes?: number;
            /** Format: double */
            value?: number;
        };
        /** @enum {string} */
        RejectionType: "permanent" | "temporary";
        ReleaseDecisionResource: {
            approved?: boolean;
            temporarilyRejected?: boolean;
            rejected?: boolean;
            rejections?: components["schemas"]["DownloadRejectionResource"][] | null;
        };
        ReleaseEpisodeResource: {
            /** Format: int32 */
            id?: number;
            /** Format: int32 */
            seasonNumber?: number;
            /** Format: int32 */
            episodeNumber?: number;
            /** Format: int32 */
            absoluteEpisodeNumber?: number | null;
            title?: string | null;
        };
        ReleaseGrabResource: {
            guid: string | null;
            /** Format: int32 */
            indexerId: number;
            override?: components["schemas"]["OverrideReleaseResource"];
            searchInfo?: components["schemas"]["SearchInfoResource"];
        };
        ReleaseHistoryResource: {
            /** Format: date-time */
            grabbed?: string | null;
            /** Format: date-time */
            failed?: string | null;
        };
        ReleaseInfoResource: {
            guid?: string | null;
            /** Format: int32 */
            age?: number;
            /** Format: double */
            ageHours?: number;
            /** Format: double */
            ageMinutes?: number;
            /** Format: int64 */
            size?: number;
            /** Format: int32 */
            indexerId?: number;
            indexer?: string | null;
            title?: string | null;
            /** Format: int32 */
            tvdbId?: number;
            /** Format: int32 */
            tvRageId?: number;
            imdbId?: string | null;
            rejections?: string[] | null;
            /** Format: date-time */
            publishDate?: string;
            commentUrl?: string | null;
            downloadUrl?: string | null;
            infoUrl?: string | null;
            magnetUrl?: string | null;
            infoHash?: string | null;
            /** Format: int32 */
            seeders?: number | null;
            /** Format: int32 */
            leechers?: number | null;
            protocol?: components["schemas"]["DownloadProtocol"];
            /** Format: int32 */
            indexerFlags?: number;
        };
        ReleaseProfileResource: {
            /** Format: int32 */
            id?: number;
            name?: string | null;
            enabled?: boolean;
            required?: string[] | null;
            ignored?: string[] | null;
            indexerIds?: number[] | null;
            tags?: number[] | null;
            excludedTags?: number[] | null;
        };
        ReleasePushResource: {
            /** Format: int32 */
            id?: number;
            guid?: string | null;
            /** Format: int64 */
            size?: number;
            /** Format: int32 */
            indexerId?: number;
            indexer?: string | null;
            title?: string | null;
            /** Format: int32 */
            tvdbId?: number;
            /** Format: int32 */
            tvRageId?: number;
            imdbId?: string | null;
            rejections?: string[] | null;
            /** Format: date-time */
            publishDate?: string;
            commentUrl?: string | null;
            downloadUrl?: string | null;
            infoUrl?: string | null;
            magnetUrl?: string | null;
            infoHash?: string | null;
            /** Format: int32 */
            seeders?: number | null;
            /** Format: int32 */
            leechers?: number | null;
            protocol?: components["schemas"]["DownloadProtocol"];
            /** Format: int32 */
            indexerFlags?: number;
            /** Format: int32 */
            downloadClientId?: number | null;
            downloadClientName?: string | null;
        };
        ReleaseResource: {
            /** Format: int32 */
            id?: number;
            parsedInfo?: components["schemas"]["ParsedEpisodeInfoResource"];
            release?: components["schemas"]["ReleaseInfoResource"];
            decision?: components["schemas"]["ReleaseDecisionResource"];
            history?: components["schemas"]["ReleaseHistoryResource"];
            /** Format: int32 */
            qualityWeight?: number;
            languages?: components["schemas"]["Language"][] | null;
            /** Format: int32 */
            mappedSeasonNumber?: number | null;
            mappedEpisodeNumbers?: number[] | null;
            mappedAbsoluteEpisodeNumbers?: number[] | null;
            /** Format: int32 */
            mappedSeriesId?: number | null;
            mappedEpisodeInfo?: components["schemas"]["ReleaseEpisodeResource"][] | null;
            episodeRequested?: boolean;
            downloadAllowed?: boolean;
            /** Format: int32 */
            releaseWeight?: number;
            customFormats?: components["schemas"]["CustomFormatResource"][] | null;
            /** Format: int32 */
            customFormatScore?: number;
            sceneMapping?: components["schemas"]["AlternateTitleResource"];
        };
        /** @enum {string} */
        ReleaseType: "unknown" | "singleEpisode" | "multiEpisode" | "seasonPack";
        RemotePathMappingResource: {
            /** Format: int32 */
            id?: number;
            host?: string | null;
            remotePath?: string | null;
            localPath?: string | null;
        };
        RenameEpisodeResource: {
            /** Format: int32 */
            id?: number;
            /** Format: int32 */
            seriesId?: number;
            /** Format: int32 */
            seasonNumber?: number;
            episodeNumbers?: number[] | null;
            /** Format: int32 */
            episodeFileId?: number;
            existingPath?: string | null;
            newPath?: string | null;
        };
        Revision: {
            /** Format: int32 */
            version?: number;
            /** Format: int32 */
            real?: number;
            isRepack?: boolean;
        };
        RootFolderResource: {
            /** Format: int32 */
            id?: number;
            path?: string | null;
            accessible?: boolean;
            isEmpty?: boolean;
            /** Format: int64 */
            freeSpace?: number | null;
            /** Format: int64 */
            totalSpace?: number | null;
            unmappedFolders?: components["schemas"]["UnmappedFolder"][] | null;
        };
        /** @enum {string} */
        RuntimeMode: "console" | "service" | "tray";
        SearchInfoResource: {
            /** Format: int32 */
            seriesId?: number | null;
            /** Format: int32 */
            seasonNumber?: number | null;
            /** Format: int32 */
            episodeId?: number | null;
        };
        SeasonPassResource: {
            series?: components["schemas"]["SeasonPassSeriesResource"][] | null;
            monitoringOptions?: components["schemas"]["MonitoringOptionsResource"];
        };
        SeasonPassSeriesResource: {
            /** Format: int32 */
            id?: number;
            monitored?: boolean | null;
            seasons?: components["schemas"]["SeasonResource"][] | null;
        };
        SeasonResource: {
            /** Format: int32 */
            seasonNumber?: number;
            monitored?: boolean;
            statistics?: components["schemas"]["SeasonStatisticsResource"];
            images?: components["schemas"]["MediaCover"][] | null;
        };
        SeasonStatisticsResource: {
            /** Format: date-time */
            nextAiring?: string | null;
            /** Format: date-time */
            previousAiring?: string | null;
            /** Format: int32 */
            episodeFileCount?: number;
            /** Format: int32 */
            episodeCount?: number;
            /** Format: int32 */
            totalEpisodeCount?: number;
            /** Format: int32 */
            monitoredEpisodeCount?: number;
            /** Format: int64 */
            sizeOnDisk?: number;
            releaseGroups?: string[] | null;
            /** Format: double */
            readonly percentOfEpisodes?: number;
        };
        SelectOption: {
            /** Format: int32 */
            value?: number;
            name?: string | null;
            /** Format: int32 */
            order?: number;
            hint?: string | null;
        };
        SeriesEditorResource: {
            seriesIds?: number[] | null;
            monitored?: boolean | null;
            monitorNewItems?: components["schemas"]["NewItemMonitorTypes"];
            /** Format: int32 */
            qualityProfileId?: number | null;
            seriesType?: components["schemas"]["SeriesTypes"];
            seasonFolder?: boolean | null;
            rootFolderPath?: string | null;
            tags?: number[] | null;
            applyTags?: components["schemas"]["ApplyTags"];
            moveFiles?: boolean;
            deleteFiles?: boolean;
            addImportListExclusion?: boolean;
        };
        SeriesResource: {
            /** Format: int32 */
            id?: number;
            title?: string | null;
            alternateTitles?: components["schemas"]["AlternateTitleResource"][] | null;
            sortTitle?: string | null;
            status?: components["schemas"]["SeriesStatusType"];
            readonly ended?: boolean;
            profileName?: string | null;
            overview?: string | null;
            /** Format: date-time */
            nextAiring?: string | null;
            /** Format: date-time */
            previousAiring?: string | null;
            network?: string | null;
            airTime?: string | null;
            images?: components["schemas"]["MediaCover"][] | null;
            originalLanguage?: components["schemas"]["Language"];
            remotePoster?: string | null;
            seasons?: components["schemas"]["SeasonResource"][] | null;
            /** Format: int32 */
            year?: number;
            path?: string | null;
            /** Format: int32 */
            qualityProfileId?: number;
            seasonFolder?: boolean;
            monitored?: boolean;
            monitorNewItems?: components["schemas"]["NewItemMonitorTypes"];
            useSceneNumbering?: boolean;
            /** Format: int32 */
            runtime?: number;
            /** Format: int32 */
            tvdbId?: number;
            /** Format: int32 */
            tvRageId?: number;
            /** Format: int32 */
            tvMazeId?: number;
            /** Format: int32 */
            tmdbId?: number;
            malIds?: number[] | null;
            aniListIds?: number[] | null;
            /** Format: date-time */
            firstAired?: string | null;
            /** Format: date-time */
            lastAired?: string | null;
            seriesType?: components["schemas"]["SeriesTypes"];
            cleanTitle?: string | null;
            imdbId?: string | null;
            titleSlug?: string | null;
            rootFolderPath?: string | null;
            folder?: string | null;
            certification?: string | null;
            genres?: string[] | null;
            tags?: number[] | null;
            /** Format: date-time */
            added?: string;
            addOptions?: components["schemas"]["AddSeriesOptions"];
            ratings?: components["schemas"]["Ratings"];
            statistics?: components["schemas"]["SeriesStatisticsResource"];
            episodesChanged?: boolean | null;
        };
        SeriesStatisticsResource: {
            /** Format: int32 */
            seasonCount?: number;
            /** Format: int32 */
            episodeFileCount?: number;
            /** Format: int32 */
            episodeCount?: number;
            /** Format: int32 */
            totalEpisodeCount?: number;
            /** Format: int32 */
            monitoredEpisodeCount?: number;
            /** Format: int64 */
            sizeOnDisk?: number;
            releaseGroups?: string[] | null;
            /** Format: double */
            readonly percentOfEpisodes?: number;
        };
        /** @enum {string} */
        SeriesStatusType: "continuing" | "ended" | "upcoming" | "deleted";
        /** @enum {string} */
        SeriesSubresource: "seasonImages";
        SeriesTitleInfo: {
            title?: string | null;
            titleWithoutYear?: string | null;
            /** Format: int32 */
            year?: number;
            allTitles?: string[] | null;
        };
        /** @enum {string} */
        SeriesTypes: "standard" | "daily" | "anime";
        /** @enum {string} */
        SortDirection: "default" | "ascending" | "descending";
        SystemResource: {
            appName: string | null;
            instanceName: string | null;
            version: string | null;
            /** Format: date-time */
            buildTime?: string;
            isDebug?: boolean;
            isProduction?: boolean;
            isAdmin?: boolean;
            isUserInteractive?: boolean;
            startupPath: string | null;
            appData: string | null;
            osName: string | null;
            osVersion: string | null;
            isNetCore?: boolean;
            isLinux?: boolean;
            isOsx?: boolean;
            isWindows?: boolean;
            isDocker?: boolean;
            mode?: components["schemas"]["RuntimeMode"];
            branch: string | null;
            authentication?: components["schemas"]["AuthenticationType"];
            /** Format: int32 */
            migrationVersion?: number;
            urlBase: string | null;
            runtimeVersion: string | null;
            runtimeName: string | null;
            /** Format: date-time */
            startTime?: string;
            packageVersion: string | null;
            packageAuthor: string | null;
            packageUpdateMechanism?: components["schemas"]["UpdateMechanism"];
            packageUpdateMechanismMessage: string | null;
            databaseVersion: string | null;
            databaseType?: components["schemas"]["DatabaseType"];
        };
        TagDetailsResource: {
            /** Format: int32 */
            id?: number;
            label?: string | null;
            delayProfileIds?: number[] | null;
            importListIds?: number[] | null;
            notificationIds?: number[] | null;
            restrictionIds?: number[] | null;
            excludedReleaseProfileIds?: number[] | null;
            indexerIds?: number[] | null;
            downloadClientIds?: number[] | null;
            autoTagIds?: number[] | null;
            seriesIds?: number[] | null;
        };
        TagResource: {
            /** Format: int32 */
            id?: number;
            label?: string | null;
        };
        TaskResource: {
            /** Format: int32 */
            id?: number;
            name?: string | null;
            taskName?: string | null;
            /** Format: int32 */
            interval?: number;
            /** Format: date-time */
            lastExecution?: string;
            /** Format: date-time */
            lastStartTime?: string;
            /** Format: date-time */
            nextExecution?: string;
            /** Format: date-span */
            lastDuration?: string;
        };
        /** @enum {string} */
        TrackedDownloadState: "downloading" | "importBlocked" | "importPending" | "importing" | "imported" | "failedPending" | "failed" | "ignored";
        /** @enum {string} */
        TrackedDownloadStatus: "ok" | "warning" | "error";
        TrackedDownloadStatusMessage: {
            title?: string | null;
            messages?: string[] | null;
        };
        UiSettingsResource: {
            /** Format: int32 */
            id?: number;
            /** Format: int32 */
            firstDayOfWeek?: number;
            calendarWeekColumnHeader?: string | null;
            shortDateFormat?: string | null;
            longDateFormat?: string | null;
            timeFormat?: string | null;
            timeZone?: string | null;
            showRelativeDates?: boolean;
            enableColorImpairedMode?: boolean;
            theme?: string | null;
            /** Format: int32 */
            uiLanguage?: number;
        };
        UnmappedFolder: {
            name?: string | null;
            path?: string | null;
            relativePath?: string | null;
        };
        UpdateChanges: {
            new?: string[] | null;
            fixed?: string[] | null;
        };
        /** @enum {string} */
        UpdateMechanism: "builtIn" | "script" | "external" | "apt" | "docker";
        UpdateResource: {
            /** Format: int32 */
            id?: number;
            version: string | null;
            branch: string | null;
            /** Format: date-time */
            releaseDate?: string;
            fileName: string | null;
            url: string | null;
            installed?: boolean;
            /** Format: date-time */
            installedOn?: string | null;
            installable?: boolean;
            latest?: boolean;
            changes: components["schemas"]["UpdateChanges"];
            hash: string | null;
        };
        UpdateSettingsResource: {
            /** Format: int32 */
            id?: number;
            branch?: string | null;
            updateAutomatically?: boolean;
            updateMechanism?: components["schemas"]["UpdateMechanism"];
            updateScriptPath?: string | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
