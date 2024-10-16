import { format } from "date-fns";
import { url } from "@env";



//import config from "../app.json";
//const url = config.url;

export const pay = (order, type, sum, invoice) => {

  //invoice= generateInvoiceNumber();
  var date = new Date();

  var options = { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  var d;

  if (typeof order[0].timestamp != 'undefined') {


    //var da = new Date(order[0].timestamp);;
    // d = da.toLocaleString('en-US',options);
    d = checkDate(order[0].timestamp)

  }
  else {
    //  d = date.toLocaleString('en-US', options);

    d = format(date, 'dd/MM/yyyy, HH:mm:ss');

  }

  const exportData = addToLine(order, type, d, invoice);
  const currentPayment = [[]];
  currentPayment[0][0] = d;
  currentPayment[0][1] = invoice;
  currentPayment[0][2] = sum;
  currentPayment[0][3] = type;
  currentPayment[0][4] = 0;
  currentPayment[0][5] = 0;
  const exportPayment = {
    order: exportData,
    payment: currentPayment,
    day: d
  };

  postAsync(exportPayment);
  return (exportPayment);
};

const postAsync = async (data) => {



  /* try {
 
     const response = await fetch(url + '?action=addSales', {
       method: 'POST',
       mode: 'no-cors',
       cache: 'no-cache',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       redirect: 'follow',
       body: JSON.stringify(data)
     });
     const res = await response.json();
     //   console.log("thanh cong:",res);
     // enter you logic when the fetch is successful
     //  console.log(res);
   } catch (error) {
     // enter your logic for when there is an error (ex. error toast)
 
     console.log("addSalse loi:", error)
   }
 */
};

const addToLine = (order, type, d, invoice) => {

  let exportData = [];
  order.forEach(orderLine => {
    let currentLine = [];
    currentLine[0] = d;
    currentLine[1] = invoice;
    currentLine[2] = orderLine.sku;
    currentLine[3] = orderLine.description;
    currentLine[4] = orderLine.quantity;
    currentLine[5] = orderLine.price;
    currentLine[6] = type;
    currentLine[7] = 0;

    exportData.push(currentLine);
  });
  return exportData;
}

export function updateTable(data, table, d, invoice) {

  const exportData = addToLine(data, table, d, invoice);
  const dataTable = {
    table: exportData

  }
  postTable(dataTable, table);
}

const postTable = async (dataTable, table) => {


  try {

    const response = await fetch(`${url}?action=addTables&table=${table}`, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify(dataTable)
    });

    const res = await response.json();
    // enter you logic when the fetch is successful
    //   console.log("thanh cong:",res);

  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log("addTable loi:", error)
  }

};

export const getPayment = async () => {
  try {

    let response = await fetch(url + '?action=getPayments');
    let { r2, r3 } = await response.json();

    let R2;
    let R3;

    if (r2) {
      R2 = r2.map((report) => { report[0] = checkDate(report[0]); return report })



    }
    else { R2 = []; }
    if (typeof r3 != 'undefined') {//[, ...R2] = r2.map((report) => report);
      R3 = r3;
    }
    else {
      R3 = [];
    }

    let Data = {};


    Data.R2 = R2;
    Data.R3 = R3;

    return Data;
    // enter you logic when the fetch is successful
    //  console.log(res);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error)
  }

};

export const getPayToday = async () => {
  try {

    let response = await fetch(url + '?action=getPayToday');
    let { r1 } = await response.json();
    let R1;


    if (r1) {
      R1 = r1.map((report) => { report[0] = checkDate(report[0]); return report })


      //   R1= r1;

    }
    else { R1 = []; }


    let Data = {};

    Data.R1 = R1;


    return Data;
    // enter you logic when the fetch is successful
    //  console.log(res);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error)
  }

};

export const getSales = async () => {
  try {

    let response = await fetch(url + '?action=getSale');
    let data = await response.json();


    //  data =groupBy(data,1);
    //  delete data['invoice'];

    return data;
    // enter you logic when the fetch is successful
    //  console.log(res);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error)
  }

};

export const getInvoice = async () => {
  try {

    let response = await fetch(url + '?action=getInvoice');
    let data = await response.json();
    return data;
    // enter you logic when the fetch is successful
    //  console.log(res);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log("getInvoice loi:", error)
  }

};

export const generateInvoiceNumber = () => {
  /*
  const date = new Date();
  const y= date.getFullYear();
  const m=(date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1);
  const d=date.getDate()<10?'0'+date.getDate():date.getDate();
  const today= y+m+d;
  let invoiceNumber = '';
 


if (invoice=='' || invoice==null){
  invoiceNumber=today+'-'+'001';

}
else
{
  const ngay=invoice.substr(0,8);
 
  const num=invoice.substr(9,3);
 
  if (ngay==today){
   let invoiceN= parseInt(num)+1;
    if (invoiceN<10) invoiceN='00'+invoiceN;
     else
     if (invoiceN<100) invoiceN = '0'+invoiceN;
    
    invoiceNumber=ngay+'-'+invoiceN;
  }
  else{
    invoiceNumber=today+'-'+'001';
  }
  
}*/
  const date = new Date();

  let y = date.getFullYear();
  y = y.toString().substring(2);

  const m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const today = y.toString() + m.toString() + d.toString();

  const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const ms = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

  const id = h.toString() + ms.toString() + s.toString();
  const invoiceNumber = today + '-' + id;
  return invoiceNumber;
}

export const getItems = async () => {
  const APIKey = 'AIzaSyCtbGcdYMWabSFvzQalE3lsez_QZ-yxqcQ';
  const SheetID = '1pMHD_IKfWdYAoMFzIHNmwnxvzOn3JOgklL1eGxzL8Ns';
  const SheetName = 'Items';

  try {
    let data = await fetch(url + "?action=getItems"
      //   "https://sheets.googleapis.com/v4/spreadsheets/"+SheetID+"/values/"+SheetName+"?valueRenderOption=FORMATTED_VALUE&key="+APIKey
      //"https://sheets.googleapis.com/v4/spreadsheets/1pMHD_IKfWdYAoMFzIHNmwnxvzOn3JOgklL1eGxzL8Ns/values/Items?valueRenderOption=FORMATTED_VALUE&key=AIzaSyCtbGcdYMWabSFvzQalE3lsez_QZ-yxqcQ"
    );
    let { items, drinks, others } = await data.json();
    // let { drinks } = await data.json();
    // let { others } = await data.json();

    // let [, ...Item] = items.map((item) => item);
    // let [, ...Drink] = drinks.map((drink) => drink);
    // let [, ...Other] = others.map((other) => other);
    let Data = {};
    Data.Items = items;
    Data.Drinks = drinks;
    Data.Others = others;

    return Data;
  } catch {
    console.log("getItem loi :", Error);
  }
};

export const getReport = async () => {
  let data = {};
  try {

    let response = await fetch(url + '?action=getReport');
    let report = await response.json();
    let response2 = await fetch(url + '?action=getReport2');
    let report2 = await response2.json();

    data.R1 = report;
    data.R2 = report2;
    // console.log(data.R2);
    return data;
    // enter you logic when the fetch is successful

  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error)
  }
};

export const getReport67 = async (m, y, o) => {
  try {

    let response = await fetch(`${url}?action=getReport67&m=${m}&y=${y}&o=${o}`);
    let data = await response.json();

    return data;


    // enter you logic when the fetch is successful
    //  console.log(res);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error)
  }

};


export const updateStatus = async (index, status, sum, ti) => {

  // let data ={};
  try {

    let response = await fetch(`${url}?action=updateStatus&index=${index}&status=${status}&sumtotal=${sum}&timestamp=${ti}`);
    let data = await response.json();

    //    return data;
    // enter you logic when the fetch is successful
    //  console.log(res);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log("Update status loi:", error)
  }
};

export const getStatus = async () => {
  try {

    let response = await fetch(`${url}?action=getStatus`);
    let data = await response.json();

    return data.type;
    // enter you logic when the fetch is successful
    //  console.log(res);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error)
  }

};

export const getTable = async (table) => {
  try {

    let response = await fetch(`${url}?action=getTables&table=${table}`);
    let data = await response.json();
    return table2Order(data.table);


    // enter you logic when the fetch is successful
    // console.log(data);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log(error)
  }

};

export const checkStatus = async (sku) => {
  try {

    let response = await fetch(`${url}?action=checkStatus&sku=${sku}`);
    let data = await response.json();
    return data;


    // enter you logic when the fetch is successful
    //  console.log(res);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log("checkstaus loi:", error)
  }

};

export const table2Order = (table) => {
  // console.log(table);
  let order = [];
  table.forEach(item => {
    let dataString = { timestamp: `${item[0]}`, invoice: `${item[1]}`, sku: `${item[2]}`, description: `${item[3]}`, quan: `${item[4]}`, price: `${item[5]}`, type: `${item[7]}` };
    order.push(dataString);
  })
  return order;

}

export const clearTable = async (table) => {
  try {

    let response = await fetch(`${url}?action=clearTable&table=${table}`);
    let data = await response.json();

    return data;
    // enter you logic when the fetch is successful
    //  console.log(res);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)

    console.log("clear table:", error);
  }

};

export const convertNumber = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const checkDate = (d) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(d)) {
    return d;
  }
  d = new Date(d);
  return format(d, 'dd/MM/yyyy, HH:mm:ss');

};



