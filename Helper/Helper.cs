using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using UtilitiesEngine.Casting;

namespace MarketingHunter.Helper
{
    public class Helper
    {
        public static SendEmailDTO SendEmail(string from, string to, string cc, string bcc, string subject, string body, string attachment)
        {
            SendEmailDTO sendEmailDTO = new SendEmailDTO();
            try
            {
                MailMessage message = new MailMessage();
                if (attachment != "")
                    message.Attachments.Add(new Attachment(attachment));
                message.From = new MailAddress(from);
                if (to.IndexOf(';') != -1)
                {
                    string[] Tos = to.Split(';');
                    foreach (string toRecipient in Tos)
                    {
                        message.To.Add(toRecipient);
                    }
                }
                else
                {
                    message.To.Add(to);
                }
                if (cc != "")
                    message.CC.Add(cc);
                if (bcc != "")
                    message.Bcc.Add(bcc);
                message.Subject = subject;
                message.Body = body;
                message.IsBodyHtml = true;
                SmtpClient smtp = new SmtpClient(ConfigurationManager.AppSettings["smtpServer"], Caster.toInt(ConfigurationManager.AppSettings["smtpPort"], 0));
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential(ConfigurationManager.AppSettings["smtpUsername"], ConfigurationManager.AppSettings["smtpPassword"]);
                smtp.EnableSsl = Caster.toBoolean(ConfigurationManager.AppSettings["isSSLRequired"], false);
                smtp.Send(message);

                sendEmailDTO.result = "success";
                sendEmailDTO.message = "An email has been sent to you";
            }
            catch (Exception ex)
            {
                sendEmailDTO.result = "error";
                sendEmailDTO.message = ex.Message;
            }
            return sendEmailDTO;
        }

    }

    public class SendEmailDTO
    {
        public string result { get; set; }
        public string message { get; set; }
        public int? data { get; set; }
    }
}