package pin.loocks.data.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import pin.loocks.domain.models.Tag;

public interface TagsRepository extends JpaRepository<Tag, Long>  {
}
