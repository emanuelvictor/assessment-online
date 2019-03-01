package br.com.ubest.infrastructure.resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;

public abstract class AbstractResource<T> {

    @Autowired
    protected Page page;

    public Page getPage() {
        return page;
    }

    public Pageable getPageable() {
        if (page != null)
            return page.getPageable();
        return null;
    }

}
