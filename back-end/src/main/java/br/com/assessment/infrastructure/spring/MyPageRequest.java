package br.com.assessment.infrastructure.spring;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.server.ServerWebExchange;

public class MyPageRequest extends PageRequest {

    public MyPageRequest(/*ServerWebExchange serverWebExchange*/) {
        super(0, 999999999);
    }

    public static PageRequest of(ServerWebExchange serverWebExchange) {
        return of(0, 999999999);
    }


    //    private static final long serialVersionUID = -4541509938956089562L;
//
//    private final Sort sort;
//
//
//
//    public MyPageRequest() {
//        super(0,999999999);
//        this.sort = Sort.unsorted();
//    }
//
//    /**
//     * Creates a new {@link MyPageRequest}. Pages are zero indexed, thus providing 0 for {@code page} will return the first
//     * page.
//     *
//     * @param page zero-based page index.
//     * @param size the size of the page to be returned.
//     * @deprecated use {@link #of(int, int)} instead.
//     */
//    @Deprecated
//    public MyPageRequest(int page, int size) {
//        this(page, size, Sort.unsorted());
//    }
//
//    /**
//     * Creates a new {@link MyPageRequest} with sort parameters applied.
//     *
//     * @param page zero-based page index.
//     * @param size the size of the page to be returned.
//     * @param direction the direction of the {@link Sort} to be specified, can be {@literal null}.
//     * @param properties the properties to sort by, must not be {@literal null} or empty.
//     * @deprecated use {@link #of(int, int, Sort.Direction, String...)} instead.
//     */
//    @Deprecated
//    public MyPageRequest(int page, int size, Sort.Direction direction, String... properties) {
//        this(page, size, Sort.by(direction, properties));
//    }
//
//    /**
//     * Creates a new {@link MyPageRequest} with sort parameters applied.
//     *
//     * @param page zero-based page index.
//     * @param size the size of the page to be returned.
//     * @param sort can be {@literal null}.
//     * @deprecated since 2.0, use {@link #of(int, int, Sort)} instead.
//     */
//    @Deprecated
//    public MyPageRequest(int page, int size, Sort sort) {
//
//        super(page, size);
//
//        this.sort = sort;
//    }
//
//    /**
//     * Creates a new unsorted {@link MyPageRequest}.
//     *
//     * @param page zero-based page index.
//     * @param size the size of the page to be returned.
//     * @since 2.0
//     */
//    public static MyPageRequest of(int page, int size) {
//        return of(page, size, Sort.unsorted());
//    }
//
//    /**
//     * Creates a new {@link MyPageRequest} with sort parameters applied.
//     *
//     * @param page zero-based page index.
//     * @param size the size of the page to be returned.
//     * @param sort must not be {@literal null}.
//     * @since 2.0
//     */
//    public static MyPageRequest of(int page, int size, Sort sort) {
//        return new MyPageRequest(page, size, sort);
//    }
//
//    /**
//     * Creates a new {@link MyPageRequest} with sort direction and properties applied.
//     *
//     * @param page zero-based page index.
//     * @param size the size of the page to be returned.
//     * @param direction must not be {@literal null}.
//     * @param properties must not be {@literal null}.
//     * @since 2.0
//     */
//    public static MyPageRequest of(int page, int size, Sort.Direction direction, String... properties) {
//        return of(page, size, Sort.by(direction, properties));
//    }
//
//    /*
//     * (non-Javadoc)
//     * @see Pageable#getSort()
//     */
//    public Sort getSort() {
//        return sort;
//    }
//
//    /*
//     * (non-Javadoc)
//     * @see Pageable#next()
//     */
//    public Pageable next() {
//        return new MyPageRequest(getPageNumber() + 1, getPageSize(), getSort());
//    }
//
//    /*
//     * (non-Javadoc)
//     * @see AbstractPageRequest#previous()
//     */
//    public MyPageRequest previous() {
//        return getPageNumber() == 0 ? this : new MyPageRequest(getPageNumber() - 1, getPageSize(), getSort());
//    }
//
//    /*
//     * (non-Javadoc)
//     * @see Pageable#first()
//     */
//    public Pageable first() {
//        return new MyPageRequest(0, getPageSize(), getSort());
//    }
//
//    /*
//     * (non-Javadoc)
//     * @see java.lang.Object#equals(java.lang.Object)
//     */
//    @Override
//    public boolean equals(@Nullable Object obj) {
//
//        if (this == obj) {
//            return true;
//        }
//
//        if (!(obj instanceof MyPageRequest)) {
//            return false;
//        }
//
//        MyPageRequest that = (MyPageRequest) obj;
//
//        return super.equals(that) && this.sort.equals(that.sort);
//    }
//
//    /*
//     * (non-Javadoc)
//     * @see java.lang.Object#hashCode()
//     */
//    @Override
//    public int hashCode() {
//        return 31 * super.hashCode() + sort.hashCode();
//    }
//
//    /*
//     * (non-Javadoc)
//     * @see java.lang.Object#toString()
//     */
//    @Override
//    public String toString() {
//        return String.format("Page request [number: %d, size %d, sort: %s]", getPageNumber(), getPageSize(), sort);
//    }
}
