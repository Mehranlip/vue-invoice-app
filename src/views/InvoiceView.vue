<template>
  <div>{{currentInvoice.invoiceId}}</div>
</template>

<script>
import {mapMutations , mapState} from "vuex";
export default {
  name : "invoiceView",
  data(){
    return{
      currentInvoice : null,
    }
  },
  created() {
    this.getCurrentInvoice()
  },
  methods:{
    ...mapMutations(["SET_CURRENT_INVOICE"]),

    getCurrentInvoice() {
      this.SET_CURRENT_INVOICE(this.$route.params.invoiceId);
      this.currentInvoice = this.currentInvoiceArray[0];
    },
  },
  computed:{
    ...mapState(["currentInvoiceArray"]),


  },
};
</script>

<style>

</style>