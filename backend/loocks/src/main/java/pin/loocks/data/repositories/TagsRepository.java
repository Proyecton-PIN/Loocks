package pin.loocks.data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pin.loocks.domain.models.Tag;

public interface TagsRepository extends JpaRepository<Tag, Long>  {
  List<Tag> findByValueIn(List<String> values);
}
