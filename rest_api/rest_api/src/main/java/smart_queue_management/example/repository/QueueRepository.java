package smart_queue_management.example.repository;

import smart_queue_management.example.entity.Queue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QueueRepository extends JpaRepository<Queue, Long> {

    List<Queue> findByStatusOrderByTokenNumberAsc(Queue.QueueStatus status);

    List<Queue> findAllByOrderByTokenNumberAsc();
}