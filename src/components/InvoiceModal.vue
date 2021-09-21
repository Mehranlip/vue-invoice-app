<template>
  <div @click="checkClick" ref="invoiceWrap" class="invoice-warp flex flex-column">
    <form @submit.prevent="submitForm" class="invoice-content">
      <h1>New invoice</h1>
<!--      bill From-->
      <div class="bill-form flex flex-column">
        <h4>Bill Form</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Street Address</label>
          <input required type="text" id="billerStreetAddress" v-model="billerStreetAddress">
        </div>
<!--        location-->
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">city</label>
            <input required type="text" id="billerCity" v-model="billerCity">
          </div>
<!--          -->
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip Code</label>
            <input required type="text" id="billerZipCode" v-model="billerZipCode">
          </div>
<!--          -->
          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input required type="text" id="billerCountry" v-model="billerCountry">
          </div>
<!--          -->
        </div>
      </div>
<!--      bill To-->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">client Name</label>
          <input required type="text" id="clientName" v-model="clientName">
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">client's Email</label>
          <input required type="text" id="clientEmail" v-model="clientEmail">
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Street Address</label>
          <input required type="text" id="clientStreetAddress" v-model="clientStreetAddress">
        </div>
<!--        -->
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">clien tCity</label>
            <input required type="text" id="clientCity" v-model="clientCity">
          </div>
          <!--          -->
          <div class="input flex flex-column">
            <label for="clientZipCode">client Zip Code</label>
            <input required type="text" id="clientZipCode" v-model="clientZipCode">
          </div>
          <!--          -->
          <div class="input flex flex-column">
            <label for="clientCountry">client Country</label>
            <input required type="text" id="clientCountry" v-model="clientCountry">
          </div>
          <!--          -->
        </div>
      </div>
<!--      Invoice work Details-->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Invoice Date</label>
            <input disabled type="text" id="invoiceDate" v-model="invoiceDate">
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment Due</label>
            <input disabled type="text" id="paymentDueDate" v-model="paymentDueDate">
          </div>
        </div>
<!--        -->
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select required type="text" id="paymentTerms" v-model="paymentTerms">
            <option value="30">Net 30 Day</option>
            <option value="60">Net 60 Day</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input required type="text" id="productDescription" v-model="productDescription">
        </div>
<!--        -->
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Total</th>
            </tr>
            <tr class="table-item flex  " v-for="(item,index) in invoiceItemList" :key="index">
              <td class="item-name"><input type="text" v-model="item.itemName" /></td>
              <td class="qty"><input type="text" v-model="item.qty" /></td>
              <td class="price"><input type="text" v-model="item.price" /></td>
              <td class="total flex">${{ (item.total = item.qty * item.price)}}</td>
              <img @click="deleteInvoiceItem(item.id) " src="@/assets/icon-delete.svg" alt="">
            </tr>
          </table>
          <div @click="addNewInvoiceItem" class="flex button">
            <img src="@/assets/icon-plus.svg" alt="">
            Add New Item
          </div>
        </div>
      </div>
<!--      save/Exit-->
      <div class="save flex">
        <div class="left">
              <button @click="closeInvoice" class="red">Cancel</button>
        </div>
        <div class="right flex">
              <button @click="saveDraft" class="dark-purple">Save Draft</button>
              <button @click="publishInvoice" class="purple">Create Invoice</button>

        </div>

      </div>
    </form>
  </div>
</template>

<script>
import db from '../firebase/firebaseInit'
import {mapMutations} from 'vuex';
import {uid} from 'uid'
export default {
  name: "invoiceModal",
  data(){
    return{
      dateOptions :{year:"numeric" , month:"short", day:"numeric"},
      billerStreetAddress: null,
      billerCity: null,
      billerZipCode: null,
      billerCountry: null,
      clientName: null,
      clientEmail: null,
      clientStreetAddress: null,
      clientCity: null,
      clientZipCode: null,
      clientCountry: null,
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      paymentDueDate: null,
      productDescription: null,
      invoicePending: null,
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0,
    };
  },
  created() {
  //  get current date for invoice date field
    this.invoiceDateUnix = Date.now()
    this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString('en-us' , this.dateOptions )
  },
  methods:{
    ...mapMutations(['TOGGLE_INVOICE']),

    closeInvoice(){
      this.TOGGLE_INVOICE()

    },
    addNewInvoiceItem(){
      this.invoiceItemList.push({
        id : uid(),
        itemName : '',
        qty : '',
        price : 0,
        total : 0,
      })
    },
    deleteInvoiceItem(id){
      this.invoiceItemList = this.invoiceItemList.filter(item => item.id !== id);
    },
    calInvoiceTotal(){
      this.invoiceTotal = 0;
      this.invoiceItemList.forEach(item =>{
        this.invoiceTotal += item.total;
      })
    },
    publishInvoice(){
      this.invoicePending = true
    },
    saveDraft(){
      this.invoiceDraft = true;
    },
    async uploadInvoice(){
      if(this.invoiceItemList.length <= 0){
        alert("Please ensure you filled out work item!");
        return;
      }
      this.calInvoiceTotal();

      const dataBase = db.collection('invoices').doc();

      await dataBase.set({
        invoiceId: uid(6),
        billerStreetAddress : this.billerStreetAddress,
        billerCity : this.billerCity,
        billerZipCode : this.billerZipCode,
        billerCountry : this.billerCountry,
        clientName : this.clientName,
        clientEmail : this.clientEmail,
        clientStreetAddress : this.clientStreetAddress,
        clientCity : this.clientCity,
        clientZipCode : this.clientZipCode,
        clientCountry : this.clientCountry,
        invoiceDateUnix : this.invoiceDateUnix,
        invoiceDate : this.invoiceDate,
        paymentTerms : this.paymentTerms,
        paymentDueDateUnix : this.paymentDueDateUnix,
        paymentDueDate : this.paymentDueDate,
        productDescription : this.productDescription,
        invoicePending : this.invoicePending,
        invoiceDraft : this.invoiceDraft,
        invoiceItemList : this.invoiceItemList,
        invoiceTotal : this.invoiceTotal,
      });

      this.TOGGLE_INVOICE();
    },
    submitForm(){
      this.uploadInvoice();
    },
  },
  watch:{
    paymentTerms(){
      const futureDate = new Date();
      this.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() +parseInt(this.paymentTerms) );
      this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString('en-us', this.dateOptions)
    }
  },
}
</script>

<style lang="scss" scoped>
.invoice-warp{
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar{
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }
  .invoice-content{
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
    h1{
      margin-bottom: 48px;
      color: #ffffff;
    }
    h3{
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }
    h4{
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;

    }

  //  Bill To Bill Form
    .bill-to,
    .bill-form{
      margin-bottom: 48px;
      .location-details{
        gap: 16px;
        div{
          flex: 1;
        }
      }
    }
  // Invoice Work
    .invoice-work{
      .payment{
        gap: 24px;
        div{
          flex: 1;
        }
      }
      .work-items{
        .item-list{
          width: 100%;

        //  Item Table Styling
          .table-heading,
          .table-item{
            gap: 16px;
            font-size: 12px;

            .item-name{
              flex-basis: 50%;
            }
            .qty{
              flex-basis: 10%;
            }
            .price{
              flex-basis:20% ;
            }
            .total{
              flex-basis:20% ;
              align-self: center;
            }
          }
          .table-heading{
            margin-bottom:16px ;

            th{
              text-align:left ;
            }
          }
          .table-item{
            position: relative;
            margin-bottom: 24px;

            img{
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }
        .button{
          color: #ffffff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img{
            margin-right: 4px;
          }
        }
      }

    }
  }
  .save{
    margin-top:60px ;

    div{
      flex: 1;
    }
    .right{
      justify-content: flex-end;
    }
  }

  .input{
    margin-bottom: 24px;
  }
  label{
    font-size: 12px;
    margin-bottom: 6px;
  }
  input,
  select{
    width: 100%;
    background-color: #1e2139;
    color: #ffffff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;
    &:focus{
      outline: none;

    }
  }
}
</style>