// Small IndexedDB wrapper. localStorage is used only if IndexedDB is unavailable.
window.LedgerDB = (() => {
  const DB_NAME='pocket-ledger', DB_VERSION=3;
  let dbPromise;
  function openDB(){
    if(!('indexedDB' in window)) return Promise.resolve(null);
    if(dbPromise) return dbPromise;
    dbPromise=new Promise((resolve,reject)=>{
      const request=indexedDB.open(DB_NAME,DB_VERSION);
      request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('transactions'))db.createObjectStore('transactions',{keyPath:'id'});if(!db.objectStoreNames.contains('people'))db.createObjectStore('people',{keyPath:'id'});if(!db.objectStoreNames.contains('accounts'))db.createObjectStore('accounts',{keyPath:'id'});if(!db.objectStoreNames.contains('reminders'))db.createObjectStore('reminders',{keyPath:'id'});};
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    });
    return dbPromise;
  }
  function fallbackKey(store){return `pocket-ledger-${store}`;}
  function fallbackAll(store){try{return JSON.parse(localStorage.getItem(fallbackKey(store))||'[]')}catch{return []}}
  async function all(store){const db=await openDB();if(!db)return fallbackAll(store);return new Promise((resolve,reject)=>{const req=db.transaction(store,'readonly').objectStore(store).getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error)})}
  async function put(store,value){const db=await openDB();if(!db){const rows=fallbackAll(store);const i=rows.findIndex(x=>x.id===value.id);if(i<0)rows.push(value);else rows[i]=value;localStorage.setItem(fallbackKey(store),JSON.stringify(rows));return value}return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(value);tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error)})}
  async function remove(store,id){const db=await openDB();if(!db){localStorage.setItem(fallbackKey(store),JSON.stringify(fallbackAll(store).filter(x=>x.id!==id)));return}return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
  async function clear(store){const db=await openDB();if(!db){localStorage.removeItem(fallbackKey(store));return}return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).clear();tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
  return {all,put,remove,clear,transactions:()=>all('transactions'),people:()=>all('people'),accounts:()=>all('accounts'),reminders:()=>all('reminders'),saveTransaction:x=>put('transactions',x),deleteTransaction:id=>remove('transactions',id),savePerson:x=>put('people',x),deletePerson:id=>remove('people',id),saveAccount:x=>put('accounts',x),deleteAccount:id=>remove('accounts',id),saveReminder:x=>put('reminders',x),deleteReminder:id=>remove('reminders',id)};
})();
