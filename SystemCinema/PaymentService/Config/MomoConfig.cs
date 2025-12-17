namespace PaymentService.Config
{
    public class MomoConfig
    {
        public static string ConfigName => "Momo";

        public static string PartnerCode { get; set; } = string.Empty;
        public static string ReturnUrl {  get; set; } = string.Empty;
        public static string IpnUrl { get; set; } = string.Empty;
        public static string AccessKey { get; set; } = string.Empty;
        public static string SercretKey { get; set; } = string.Empty;
        public static string PaymentUrl { get; set; } = string.Empty;
    }
}
