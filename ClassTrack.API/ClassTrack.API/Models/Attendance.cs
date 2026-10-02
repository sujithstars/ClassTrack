namespace ClassTrack.API.Models
{
    public class Attendance
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public DateTime AttendanceDate { get; set; }

        public string Status { get; set; }
    }
}