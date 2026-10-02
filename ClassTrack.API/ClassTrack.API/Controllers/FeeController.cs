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
    public class FeeController : ControllerBase
    {
        private readonly ClassTrackDbContext _context;

        public FeeController(ClassTrackDbContext context)
        {
            _context = context;
        }

        // GET: api/Fee
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fee>>> Get()
        {
            return await _context.Fees.ToListAsync();
        }

        // POST: api/Fee
        [HttpPost]
        public async Task<ActionResult<Fee>> Post(Fee fee)
        {
            _context.Fees.Add(fee);

            await _context.SaveChangesAsync();

            return Ok(fee);
        }

        // PUT: api/Fee/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Fee fee)
        {
            var existingFee = await _context.Fees.FindAsync(id);

            if (existingFee == null)
            {
                return NotFound();
            }

            existingFee.StudentId = fee.StudentId;
            existingFee.Amount = fee.Amount;
            existingFee.PaymentDate = fee.PaymentDate;
            existingFee.PaymentStatus = fee.PaymentStatus;

            await _context.SaveChangesAsync();

            return Ok(existingFee);
        }

        // DELETE: api/Fee/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var fee = await _context.Fees.FindAsync(id);

            if (fee == null)
            {
                return NotFound();
            }

            _context.Fees.Remove(fee);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}