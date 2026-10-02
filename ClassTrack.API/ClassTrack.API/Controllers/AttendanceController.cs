using ClassTrack.API.Data;
using ClassTrack.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClassTrack.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly ClassTrackDbContext _context;

        public AttendanceController(ClassTrackDbContext context)
        {
            _context = context;
        }

        // GET: api/Attendance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> Get()
        {
            return await _context.Attendances.ToListAsync();
        }

        // POST: api/Attendance
        [HttpPost]
        public async Task<ActionResult<Attendance>> Post(Attendance attendance)
        {
            _context.Attendances.Add(attendance);

            await _context.SaveChangesAsync();

            return Ok(attendance);
        }

        // PUT: api/Attendance/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Attendance attendance)
        {
            var existingAttendance =
                await _context.Attendances.FindAsync(id);

            if (existingAttendance == null)
            {
                return NotFound();
            }

            existingAttendance.StudentId = attendance.StudentId;
            existingAttendance.AttendanceDate = attendance.AttendanceDate;
            existingAttendance.Status = attendance.Status;

            await _context.SaveChangesAsync();

            return Ok(existingAttendance);
        }

        // DELETE: api/Attendance/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var attendance =
                await _context.Attendances.FindAsync(id);

            if (attendance == null)
            {
                return NotFound();
            }

            _context.Attendances.Remove(attendance);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}