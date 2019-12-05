package online.meavalia.infrastructure.org.springframework.data.domain;

import org.springframework.data.domain.AbstractPageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.lang.Nullable;
import org.springframework.web.server.ServerWebExchange;

import java.util.ArrayList;
import java.util.List;

/**
 * Basic Java Bean implementation of {@code Pageable}.
 *
 * @author Oliver Gierke
 * @author Thomas Darimont
 */
@SuppressWarnings("ALL")
public class PageRequest extends AbstractPageRequest {

    private static final long serialVersionUID = -4541509938956089562L;

    private final Sort sort;

    /**
     * Creates a new {@link PageRequest} with sort parameters applied.
     *
     * @param page zero-based page index.
     * @param size the size of the page to be returned.
     * @param sort can be {@literal null}.
     * @deprecated since 2.0, use {@link #of(int, int, Sort)} instead.
     */
    PageRequest(int page, int size, Sort sort) {

        super(page, size);

        this.sort = sort;
    }

    /**
     * @param serverWebExchange serverWebExchange
     * @return PageRequest
     */
    public static PageRequest of(final ServerWebExchange serverWebExchange) {
        if (serverWebExchange.getRequest().getQueryParams().get("size") != null) {

            final int page;

            if (serverWebExchange.getRequest().getQueryParams().get("page") != null
                    && serverWebExchange.getRequest().getQueryParams().get("page").size() > 0
                    && serverWebExchange.getRequest().getQueryParams().get("page").get(0).length() > 0)
                page = Integer.parseInt(serverWebExchange.getRequest().getQueryParams().get("page").get(0));
            else
                page = 0;

            final int size = Integer.parseInt(serverWebExchange.getRequest().getQueryParams().get("size").get(0));

            final Sort sort;

            if (serverWebExchange.getRequest().getQueryParams().get("sort") != null) {
                final String sortString = serverWebExchange.getRequest().getQueryParams().get("sort").get(0);

                final List<Sort.Order> orderList = new ArrayList<>();

                orderList.add(new Sort.Order(extractDirectionFromString(sortString), extractPropertyFromString(sortString)/*, Sort.NullHandling.NATIVE*/));

                sort = Sort.by(orderList);
//                sort = Sort.by(extractDirectionFromString(sortString), extractPropertiesFromString(sortString), Sort.NullHandling.NULLS_LAST).a;
            } else
                sort = Sort.unsorted();

            return of(page, size, sort);

        }

        return null;
    }

//    private static String[] extractAllPropertiesFromString(final String sort) {
//        return sort.split(",");
//    }

    private static String extractPropertyFromString(final String sort) {
        return sort.replace(",asc", "").replace(",desc", "");
    }

//    private static String[] extractPropertiesFromString(final String sort) {
//        return sort.replace("asc", "").replace("desc", "").split(",");
//    }

    private static Direction extractDirectionFromString(final String sort) {
        if (sort.contains("asc"))
            return Direction.ASC;
        else
            return Direction.DESC;
    }

    /**
     * Creates a new unsorted {@link PageRequest}.
     *
     * @param page zero-based page index.
     * @param size the size of the page to be returned.
     * @since 2.0
     */
    public static PageRequest of(int page, int size) {
        return of(page, size, Sort.unsorted());
    }

    /**
     * Creates a new {@link PageRequest} with sort parameters applied.
     *
     * @param page zero-based page index.
     * @param size the size of the page to be returned.
     * @param sort must not be {@literal null}.
     * @since 2.0
     */
    public static PageRequest of(int page, int size, Sort sort) {
        return new PageRequest(page, size, sort);
    }

    /**
     * Creates a new {@link PageRequest} with sort direction and properties applied.
     *
     * @param page       zero-based page index.
     * @param size       the size of the page to be returned.
     * @param direction  must not be {@literal null}.
     * @param properties must not be {@literal null}.
     * @since 2.0
     */
    public static PageRequest of(int page, int size, Direction direction, String... properties) {
        return of(page, size, Sort.by(direction, properties));
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Pageable#getSort()
     */
    public Sort getSort() {
        return sort;
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Pageable#next()
     */
    public Pageable next() {
        return new PageRequest(getPageNumber() + 1, getPageSize(), getSort());
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.AbstractPageRequest#previous()
     */
    public PageRequest previous() {
        return getPageNumber() == 0 ? this : new PageRequest(getPageNumber() - 1, getPageSize(), getSort());
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Pageable#first()
     */
    public Pageable first() {
        return new PageRequest(0, getPageSize(), getSort());
    }

    /*
     * (non-Javadoc)
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(@Nullable Object obj) {

        if (this == obj) {
            return true;
        }

        if (!(obj instanceof PageRequest)) {
            return false;
        }

        PageRequest that = (PageRequest) obj;

        return super.equals(that) && this.sort.equals(that.sort);
    }

    /*
     * (non-Javadoc)
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        return 31 * super.hashCode() + sort.hashCode();
    }

    /*
     * (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return String.format("Page request [number: %d, size %d, sort: %s]", getPageNumber(), getPageSize(), sort);
    }
}
