package pin.loocks.logic.services;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import pin.loocks.data.repositories.TagsRepository;
import pin.loocks.domain.models.Tag;

@Service
public class TagSerice {
  @Autowired
  private TagsRepository tagsRepository;

  @Transactional
  public List<Tag> getOrCreateTags(List<String> tags) {
    List<Tag> existingTags = tagsRepository.findByValueIn(tags);

    Set<String> existingValues = existingTags.stream()
        .map(t -> t.getValue())
        .collect(Collectors.toSet());

    List<String> missingValues = tags.stream()
        .filter(value -> !existingValues.contains(value))
        .distinct()
        .collect(Collectors.toList());

    if (missingValues.isEmpty())
      return existingTags;

    List<Tag> newTags = missingValues.stream()
        .map(t -> new Tag(t))
        .collect(Collectors.toList());

    tagsRepository.saveAll(newTags);

    existingTags.addAll(newTags);
    return existingTags;
  }

}
