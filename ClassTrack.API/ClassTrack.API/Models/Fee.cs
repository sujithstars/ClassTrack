namespace ClassTrack.API.Models
{
    public class Fee
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public decimal Amount { get; set; }

        public DateTime PaymentDate { get; set; }

        public string PaymentStatus { get; set; }
    }
}