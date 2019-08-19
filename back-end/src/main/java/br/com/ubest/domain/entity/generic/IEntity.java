package br.com.ubest.domain.entity.generic;

import java.io.Serializable;

/**
 * @version 1.0
 */
public interface IEntity<ID extends Serializable> extends Serializable {
    /*-------------------------------------------------------------------
     * 		 				GETTERS AND SETTERS
     *-------------------------------------------------------------------*/

    /**
     * @return ID
     */
    public  ID getId();

    /**
     * @param id ID
     */
    public void setId(ID id);
}
