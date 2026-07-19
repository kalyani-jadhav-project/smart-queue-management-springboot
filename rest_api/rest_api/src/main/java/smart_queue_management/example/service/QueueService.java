package smart_queue_management.example.service;

import smart_queue_management.example.entity.Queue;
import smart_queue_management.example.repository.QueueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QueueService {

    @Autowired
    private QueueRepository queueRepository;

    // Add a new customer to the queue
    public Queue addToQueue(String customerName) {
        int nextToken = (int) queueRepository.count() + 1;
        Queue queue = new Queue(customerName, nextToken, Queue.QueueStatus.WAITING);
        return queueRepository.save(queue);
    }

    // Get all queue entries
    public List<Queue> getAllQueueEntries() {
        return queueRepository.findAllByOrderByTokenNumberAsc();
    }

    // Get only people currently waiting
    public List<Queue> getWaitingQueue() {
        return queueRepository.findByStatusOrderByTokenNumberAsc(Queue.QueueStatus.WAITING);
    }

    // Get a single entry by id
    public Optional<Queue> getById(Long id) {
        return queueRepository.findById(id);
    }

    // Call the next person in queue (mark as SERVING)
    public Optional<Queue> callNext() {
        List<Queue> waiting = queueRepository.findByStatusOrderByTokenNumberAsc(Queue.QueueStatus.WAITING);
        if (waiting.isEmpty()) {
            return Optional.empty();
        }
        Queue next = waiting.get(0);
        next.setStatus(Queue.QueueStatus.SERVING);
        return Optional.of(queueRepository.save(next));
    }

    // Update status of a given entry (e.g. COMPLETED, CANCELLED)
    public Optional<Queue> updateStatus(Long id, Queue.QueueStatus status) {
        return queueRepository.findById(id).map(queue -> {
            queue.setStatus(status);
            return queueRepository.save(queue);
        });
    }

    // Delete an entry
    public boolean deleteEntry(Long id) {
        if (queueRepository.existsById(id)) {
            queueRepository.deleteById(id);
            return true;
        }
        return false;
    }
}