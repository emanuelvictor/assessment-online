package br.com.assessment.domain.entity.generic;

import java.io.Serializable;

/**
 * 
 * @since 22/11/2012
 * @version 1.0
 */
public interface IEntity<ID extends Serializable> extends Serializable
{
	/*-------------------------------------------------------------------
	 * 		 				GETTERS AND SETTERS
	 *-------------------------------------------------------------------*/
    /**
     *
     * @return
     */
    public ID getId();

    /**
     *
     * @param id
     */
    public void setId(ID id);
}