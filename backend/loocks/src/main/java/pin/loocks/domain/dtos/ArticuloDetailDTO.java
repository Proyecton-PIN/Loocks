package pin.loocks.domain.dtos;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;
import pin.loocks.domain.models.Articulo;

@Data
@NoArgsConstructor
public class ArticuloDetailDTO {
    private Articulo articulo;
    private List<Date> calendarioDeUso;
    private List<Articulo> sugerencias;

    public ArticuloDetailDTO(Articulo articulo) {
        this.articulo = articulo;
        this.calendarioDeUso = Collections.emptyList();
        this.sugerencias = Collections.emptyList();
    }
}