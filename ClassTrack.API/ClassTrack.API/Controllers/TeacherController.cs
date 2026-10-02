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
    public class TeacherController : ControllerBase
    {
        private readonly ClassTrackDbContext _context;

        public TeacherController(ClassTrackDbContext context)
        {
            _context = context;
        }

        // GET: api/Teacher
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teacher>>> Get()
        {
            return await _context.Teachers.ToListAsync();
        }

        // POST: api/Teacher
        [HttpPost]
        public async Task<ActionResult<Teacher>> Post(Teacher teacher)
        {
            _context.Teachers.Add(teacher);

            await _context.SaveChangesAsync();

            return Ok(teacher);
        }

        // PUT: api/Teacher/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Teacher teacher)
        {
            var existingTeacher = await _context.Teachers.FindAsync(id);

            if (existingTeacher == null)
            {
                return NotFound();
            }

            existingTeacher.TeacherName = teacher.TeacherName;
            existingTeacher.Mobile = teacher.Mobile;
            existingTeacher.Subject = teacher.Subject;

            await _context.SaveChangesAsync();

            return Ok(existingTeacher);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);

            if (teacher == null)
            {
                return NotFound();
            }

            _context.Teachers.Remove(teacher);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}