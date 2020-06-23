import {head, sidebar} from './common';
import {nav, tool, view} from './home';
import {default as auth} from './auth';
import {default as share} from './share';
import {flatObject} from "../../util";

export default flatObject({
    common: {
        head, sidebar,
    },
    home: {
        tool, nav, view
    },
    auth,
    share,
});
