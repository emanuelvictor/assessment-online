/**
 * 
 */
package com.emanuelvictor.infrastructure.hibernate.dialect;

import com.emanuelvictor.infrastructure.hibernate.functions.PostgreSQLFilterFunction;
import org.hibernate.dialect.PostgreSQL9Dialect;

/**
 * @author emanuel.fonseca
 *
 */
public class PostgreSQLDialect extends PostgreSQL9Dialect
{
	/**
	 * 
	 */
	public PostgreSQLDialect() 
	{
		super.registerFunction("FILTER", new PostgreSQLFilterFunction());
	}
}
