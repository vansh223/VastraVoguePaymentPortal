/**
 * VASTRA VOGUE — Google Apps Script backend
 *
 * Sheet columns:
 * A = Order Code
 * B = Product Name
 * C = Description
 * D = Price
 *
 * Row 1 contains headers.
 */

function doGet(e) {
  var code = String((e && e.parameter && e.parameter.code) || "").trim().toUpperCase();
  var callback = String((e && e.parameter && e.parameter.callback) || "").trim();

  var result = code
    ? findOrder(code)
    : { success: false, message: "Please enter an order code." };

  var json = JSON.stringify(result);

  if (callback && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function findOrder(code) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var values = sheet.getDataRange().getDisplayValues();

  for (var i = 1; i < values.length; i++) {
    var rowCode = String(values[i][0] || "").trim().toUpperCase();

    if (rowCode === code) {
      var product = String(values[i][1] || "").trim();
      var description = String(values[i][2] || "").trim();
      var priceText = String(values[i][3] || "").trim();

      if (!product || !priceText) {
        return { success:false, message:"This order is incomplete. Please contact Vastra Vogue." };
      }

      var price = Number(priceText.replace(/[^0-9.-]/g, ""));
      if (!isFinite(price)) {
        return { success:false, message:"This order has an invalid price. Please contact Vastra Vogue." };
      }

      return {
        success:true,
        order:{
          code:rowCode,
          product:product,
          description:description || "Vastra Vogue",
          price:price
        }
      };
    }
  }

  return { success:false, message:"Invalid order code. Please check the code and try again." };
}
