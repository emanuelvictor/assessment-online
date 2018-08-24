package br.com.assessment.domain.entity.generic;

import br.com.assessment.application.context.Context;
import org.hibernate.envers.RevisionType;

import java.io.Serializable;

/**
 * @version 1.0
 */
public class EntityTrackingRevisionListener implements org.hibernate.envers.EntityTrackingRevisionListener {
    /**
     *
     */
    @Override
    public void newRevision(Object revisionEntity) {
        final String schema = Context.getCurrentSchema();
        final String username = Context.getCurrentUsername();
        ((Revision<?, ?>) revisionEntity).setSchema(schema);
        ((Revision<?, ?>) revisionEntity).setUsername(username);
    }

    /*
     * (non-Javadoc)
     * @see org.hibernate.envers.EntityTrackingRevisionListener#entityChanged(java.lang.Class, java.lang.String, java.io.Serializable, org.hibernate.envers.RevisionType, java.lang.Object)
     */
    @Override
    @SuppressWarnings("rawtypes")
    public void entityChanged(Class entityClass, String entityName, Serializable entityId, RevisionType revisionType, Object revisionEntity) {
    }

}