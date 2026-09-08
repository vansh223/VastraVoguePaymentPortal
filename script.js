const UPI_ID="itsvansh223@okhdfcbank";
let currentOrder=null;

const gate=document.getElementById("orderGate");
const form=document.getElementById("orderForm");
const input=document.getElementById("orderCodeInput");
const error=document.getElementById("gateError");

function setError(msg){error.textContent=msg;}

function renderOrder(order){
 currentOrder=order;
 document.getElementById("productName").textContent=order.product;
 document.getElementById("productDescription").textContent=order.description;
 const price=Number(order.price)||0;
 document.getElementById("subtotal").textContent="₹"+price.toLocaleString("en-IN");
 document.getElementById("total").textContent="₹"+price.toLocaleString("en-IN");
 document.getElementById("orderId").textContent=order.code;
 document.getElementById("heroOrderCode").textContent=order.code;
 document.getElementById("successOrder").textContent=order.code;
 gate.classList.add("hidden");
 window.scrollTo({top:0,behavior:"smooth"});
}

function lookup(code){
 if(!API_URL||API_URL.includes("PASTE_YOUR_")){
  setError("The payment portal is not connected to its order database yet.");
  return;
 }
 setError("Checking your order…");
 const callback="vvCallback_"+Date.now()+"_"+Math.floor(Math.random()*10000);
 const s=document.createElement("script");
 let done=false;
 const finish=()=>{if(done)return;done=true;clearTimeout(timer);delete window[callback];s.remove()};
 const timer=setTimeout(()=>{finish();setError("Could not connect to the order database. Please try again.");},10000);
 window[callback]=(response)=>{finish();if(response&&response.success&&response.order){renderOrder(response.order)}else{setError(response?.message||"Invalid order code. Please check the code and try again.");input.focus()}};
 s.onerror=()=>{finish();setError("Could not connect to the order database. Please try again.")};
 s.src=API_URL+"?code="+encodeURIComponent(code)+"&callback="+encodeURIComponent(callback);
 document.body.appendChild(s);
}

form.addEventListener("submit",e=>{
 e.preventDefault();
 const code=input.value.trim().toUpperCase();
 if(!code){setError("Please enter your order code.");return}
 lookup(code);
});

const toast=document.getElementById("toast");
function showToast(message){toast.textContent=message;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800)}
document.getElementById("copyUpi").addEventListener("click",async()=>{
 try{await navigator.clipboard.writeText(UPI_ID);showToast("UPI ID copied!")}catch{showToast("UPI ID: "+UPI_ID)}
});
document.getElementById("paidBtn").addEventListener("click",()=>{if(currentOrder)document.getElementById("successOverlay").classList.add("show")});
document.getElementById("closeSuccess").addEventListener("click",()=>document.getElementById("successOverlay").classList.remove("show"));
document.getElementById("successOverlay").addEventListener("click",e=>{if(e.target.id==="successOverlay")e.currentTarget.classList.remove("show")});
