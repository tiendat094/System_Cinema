using Microsoft.AspNetCore.Mvc;
using PaymentService.Manager;
using PaymentService.Model;

namespace PaymentService.Controllers
{
    [ApiController]
    [Route("payment")]
    public class PaymentController : Controller
    {
        private readonly IMomoService _momoService;
        public PaymentController(IMomoService momoService)
        {
            _momoService = momoService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePaymentMomo(OrderInfoModel model)
        {
            var response = await _momoService.CreatePaymentAsync(model);
            return Ok(response);
        }
        [HttpGet]
        public IActionResult PaymentCallBack()
        {
            var response = _momoService.PaymentExecuteAsync(HttpContext.Request.Query);
            return View(response);
        }

/*        [HttpGet("callback")]
        public async Task<IActionResult> PaymentCallBack()
        {
            var requestQuery = HttpContext.Request.Query;
            var partnerCode = requestQuery["partnerCode"].ToString();
            var accessKey = requestQuery["accessKey"].ToString();
            var requestId = requestQuery["requestId"].ToString();
            var amount = requestQuery["amount"].ToString();
            var orderId = requestQuery["orderId"].ToString();
            var orderInfo = requestQuery["orderInfo"].ToString();
            var orderType = requestQuery["orderType"].ToString();
            var transId = requestQuery["transId"].ToString();
            var message = requestQuery["message"].ToString();
            var localMessage = requestQuery["localMessage"].ToString();
            var responseTime = requestQuery["responseTime"].ToString();
            var errorCode = requestQuery["errorCode"].ToString();
            var payType = requestQuery["payType"].ToString();
            var extraData = requestQuery["extraData"].ToString();
            var receivedSignature = requestQuery["signature"].ToString();
            var response = _momoService.PaymentExecuteAsync(HttpContext.Request.Query);
            var requestQuery = HttpContext.Request.Query;
            if (requestQuery["resultCode"] != 0)
            {
                return Ok();
            }
            else
            {
                return Ok();
            }
            return Ok();
        }*/
    }
}
