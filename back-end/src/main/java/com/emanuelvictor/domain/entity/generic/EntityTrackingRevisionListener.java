package com.emanuelvictor.domain.entity.generic;

import org.hibernate.envers.RevisionType;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;

import java.io.Serializable;

/**
 * 
 * @version 1.0
 * @category Entity
 * @since 06/12/2012
 */
public class EntityTrackingRevisionListener implements org.hibernate.envers.EntityTrackingRevisionListener
{
	/*-------------------------------------------------------------------
     *				 		     ATTRIBUTES
	 *-------------------------------------------------------------------*/

	/*-------------------------------------------------------------------
	 *				 		     BEHAVIORS
	 *-------------------------------------------------------------------*/

	/**
	 *
	 */
	@Override
	public void newRevision( Object revisionEntity )
	{
		try
		{
//			final User usuario = ContextHolder.getAuthenticatedUser();
//			((Revision<?, ?>) revisionEntity).setUserId( usuario.getId() );
		}
		catch ( AuthenticationCredentialsNotFoundException e )
		{
		}
	}

	/*
	 * (non-Javadoc)
	 * @see org.hibernate.envers.EntityTrackingRevisionListener#entityChanged(java.lang.Class, java.lang.String, java.io.Serializable, org.hibernate.envers.RevisionType, java.lang.Object)
	 */
	@Override
	@SuppressWarnings("rawtypes")
	public void entityChanged(Class entityClass, String entityName, Serializable entityId, RevisionType revisionType, Object revisionEntity )
	{
	}

	/*-------------------------------------------------------------------
	 *						GETTERS AND SETTERS
	 *-------------------------------------------------------------------*/
}