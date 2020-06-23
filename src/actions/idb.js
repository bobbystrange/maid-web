import {openDB} from 'idb';
import _ from "lodash";
import {getList, getListPath} from ".";

const DATABASE_NAME = "maid";
const FILES_STORE_NAME = "files";
const PATH_STORE_NAME = "path";

// [ {id, pid, name, ctime, mtime, type, size}, ]
export async function loadOrFetchFiles(id) {
    let db = await getDB();
    const tx1 = db.transaction(FILES_STORE_NAME, "readonly");
    let column = await tx1.store.get(id);
    await tx1.done;
    if (column) {
        return column.files;
    }

    // no entries in db, then fetch it
    let files = _.get(await getList(id), "data.data", []);
    if (_.isArray(files)) {
        const tx2 = db.transaction(FILES_STORE_NAME, "readwrite");
        const store2 = tx2.objectStore(FILES_STORE_NAME);
        store2.put({id, files});
        await tx2.done;
        return files;
    }
    console.error(`failed fetch files via file id '${id}' from server end`)
    return undefined;
}

export async function loadOrFetchPath(id) {
    let db = await getDB();
    const tx1 = db.transaction(PATH_STORE_NAME, "readonly");
    let column = await tx1.store.get(id);
    await tx1.done;
    if (column) {
        return column.path;
    }

    // no entries in db, then fetch it
    let path = _.get(await getListPath(id), "data.data", []);
    if (!_.isEmpty(path)) {
        const tx2 = db.transaction(PATH_STORE_NAME, "readwrite");
        const store2 = tx2.objectStore(PATH_STORE_NAME);
        store2.put({id, path});
        await tx2.done;
        return path;
    }
    console.error(`failed fetch path via file id '${id}' from server end`)
    return undefined;
}

export async function removeFilesAndPath(...ids) {
    let db = await getDB();
    const tx1 = db.transaction(FILES_STORE_NAME, "readwrite");
    const store1 = tx1.objectStore(FILES_STORE_NAME);
    ids.forEach(id => {
        store1.delete(id);
    })
    await tx1.done;

    const tx2 = db.transaction(PATH_STORE_NAME, "readwrite");
    const store2 = tx2.objectStore(PATH_STORE_NAME);
    ids.forEach(id => {
        store2.delete(id);
    })
    await tx2.done;
}

export async function removeFilesAndPathDB() {
    let db = await getDB();
    const tx2 = db.transaction(FILES_STORE_NAME, "readwrite");
    const store2 = tx2.objectStore(FILES_STORE_NAME);
    store2.clear()
    await tx2.done;
}

async function getDB() {
    return await openDB(DATABASE_NAME, 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
            if (oldVersion === 0) {
                /*const store = */
                db.createObjectStore(FILES_STORE_NAME,
                    {keyPath: 'id', autoIncrement: false});
                db.createObjectStore(PATH_STORE_NAME,
                    {keyPath: 'id', autoIncrement: false});
            }
        },
    });
}

