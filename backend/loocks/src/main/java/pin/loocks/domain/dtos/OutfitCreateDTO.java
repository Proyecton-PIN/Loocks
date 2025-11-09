package pin.loocks.domain.dtos;

import java.util.List;

/**
 * DTO para la creación de un Outfit desde la API.
 * Campos incluidos: mood, lista de ids de artículos, id de perfil propietario,
 * satisfaccion y bandera de favorito.
 */
public class OutfitCreateDTO {
    private String mood;
    private List<Long> articulosIds;
    private String perfilId;
    private String satisfaccion;
    private Boolean isFavorito;

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }

    public List<Long> getArticulosIds() {
        return articulosIds;
    }

    public void setArticulosIds(List<Long> articulosIds) {
        this.articulosIds = articulosIds;
    }

    public String getPerfilId() {
        return perfilId;
    }

    public void setPerfilId(String perfilId) {
        this.perfilId = perfilId;
    }

    public String getSatisfaccion() {
        return satisfaccion;
    }

    public void setSatisfaccion(String satisfaccion) {
        this.satisfaccion = satisfaccion;
    }

    public Boolean getIsFavorito() {
        return isFavorito;
    }

    public void setIsFavorito(Boolean isFavorito) {
        this.isFavorito = isFavorito;
    }
}
