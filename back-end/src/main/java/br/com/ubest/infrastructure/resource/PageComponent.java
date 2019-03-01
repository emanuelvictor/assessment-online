package br.com.ubest.infrastructure.resource;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class PageComponent {

    private Pageable pageable;

    public Pageable getPageable() {
        return pageable;
    }

    public void setPageable(final Pageable pageable) {
        this.pageable = pageable;
    }

}
