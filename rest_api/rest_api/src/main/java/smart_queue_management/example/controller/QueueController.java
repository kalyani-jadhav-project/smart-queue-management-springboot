package smart_queue_management.example.controller;

import smart_queue_management.example.entity.Queue;
import smart_queue_management.example.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/queue")
public class QueueController {

    @Autowired
    private QueueService queueService;

    // POST http://localhost:8080/api/queue
    // Body: { "customerName": "John Doe" }
    @PostMapping
    public ResponseEntity<Queue> addToQueue(@RequestBody Map<String, String> request) {
        String customerName = request.get("customerName");
        Queue created = queueService.addToQueue(customerName);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // GET http://localhost:8080/api/queue
    @GetMapping
    public ResponseEntity<List<Queue>> getAllQueueEntries() {
        return ResponseEntity.ok(queueService.getAllQueueEntries());
    }

    // GET http://localhost:8080/api/queue/waiting
    @GetMapping("/waiting")
    public ResponseEntity<List<Queue>> getWaitingQueue() {
        return ResponseEntity.ok(queueService.getWaitingQueue());
    }

    // GET http://localhost:8080/api/queue/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Queue> getById(@PathVariable Long id) {
        return queueService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT http://localhost:8080/api/queue/next
    // Calls the next waiting customer -> marks as SERVING
    @PutMapping("/next")
    public ResponseEntity<Queue> callNext() {
        return queueService.callNext()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // PUT http://localhost:8080/api/queue/{id}/status
    // Body: { "status": "COMPLETED" }
    @PutMapping("/{id}/status")
    public ResponseEntity<Queue> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Queue.QueueStatus status = Queue.QueueStatus.valueOf(request.get("status").toUpperCase());
        return queueService.updateStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE http://localhost:8080/api/queue/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        boolean deleted = queueService.deleteEntry(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}