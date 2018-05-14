/**
 * 
 */
package br.com.assessment.infrastructure.hibernate.functions;

import org.hibernate.QueryException;
import org.hibernate.dialect.function.SQLFunction;
import org.hibernate.engine.spi.Mapping;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.type.BooleanType;
import org.hibernate.type.Type;

import java.util.List;

/**
 * @author emanuel.fonseca
 *
 */
public class PostgreSQLFullTextSearchFunction implements SQLFunction
{
	/**
	 * 
	 */
	@Override
	@SuppressWarnings("rawtypes")
	public String render(Type firstArgumentType, List arguments, SessionFactoryImplementor factory) throws QueryException
	{
		try 
		{
			String fragment = null;
			
			final String field = (String) arguments.get(0);
			final String value = (String) arguments.get(1);	
			
			try 
			{
				final String config = (String) arguments.get(2);
				fragment = "to_tsvector("+ config +", "+ field +") @@ " + "to_tsquery("+ config +", "+ value +")";
			}
			catch (IndexOutOfBoundsException e)
			{
				fragment = "to_tsvector('simple', "+ field +") @@ " + "to_tsquery('simple', "+ value +")";
			}
			
			return fragment;
		} 
		catch (IndexOutOfBoundsException e) 
		{
			throw new IllegalArgumentException("The function must be passed 2 or 3 arguments");
		}
	}

	/**
	 * 
	 */
	@Override
	public Type getReturnType(Type columnType, Mapping mapping) throws QueryException
	{
		return new BooleanType();
	}

	/**
	 * 
	 */
	@Override
	public boolean hasArguments() 
	{
		return true;
	}

	/**
	 * 
	 */
	@Override
	public boolean hasParenthesesIfNoArguments() 
	{
		return false;
	}
}
