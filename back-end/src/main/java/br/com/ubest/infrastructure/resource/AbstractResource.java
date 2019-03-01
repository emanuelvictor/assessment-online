package br.com.ubest.infrastructure.resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;

public abstract class AbstractResource<T> {

    @Autowired
    protected PageComponent pageComponent;

    public PageComponent getPage() {
        return pageComponent;
    }

    public Pageable getPageable() {
        if (pageComponent != null)
            return pageComponent.getPageable();
        return null;
    }

}
