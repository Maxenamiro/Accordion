import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFI, SPFx } from '@pnp/sp';
import { LogLevel, PnPLogging } from '@pnp/logging';

import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/batching';

let _sp: SPFI | undefined; // Указываем тип undefined

export const getSP = (context: WebPartContext): SPFI => {
    if (!_sp) {
        _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
    }
    return _sp; // Возвращаем _sp, который теперь гарантированно не undefined
};

