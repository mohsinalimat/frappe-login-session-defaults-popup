import {
    start_plugin
} from './utils/utils.js';

try {
    $(document).ready(start_plugin);
} catch(e) {
    start_plugin();
}
