namespace PaymentService.Model
{
    public class MomoCallback
    {
        public string PartnerCode { set; get; }
        public string AccessKey { set; get; }
        public string RequestId { set; get; }
        public double amount { set; get; }
        public string OrderInfo { set; get; }
        public string OrderType { set; get; }
        public string Message { set; get; }
        public DateTime ResponseTime { set; get; }
        public string LocalMessage { set; get; }
        public string ErrorCode { set; get; }
        public string PayType { set; get; }
        public string ExtraData { set; get; }
        public string Signature { set; get; }

    }

     
}
