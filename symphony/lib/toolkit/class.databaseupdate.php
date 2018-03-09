<?php

/**
 * @package toolkit
 */

/**
 * This DatabaseStatement specialization class allows creation of UPDATE statements.
 */
final class DatabaseUpdate extends DatabaseStatement
{
    use DatabaseWhereDefinition;

    /**
     * Creates a new DatabaseUpdate statement on table $table.
     *
     * @see Database::update()
     * @param Database $db
     *  The underlying database connection
     * @param string $table
     *  The name of the table to act on, including the tbl prefix which will be changed
     *  to the Database table prefix.
     */
    public function __construct(Database $db, $table)
    {
        parent::__construct($db, 'UPDATE');
        $table = $this->replaceTablePrefix($table);
        $table = $this->asTickedString($table);
        $this->unsafeAppendSQLPart('table', $table);
    }

    /**
     * Returns the parts statement structure for this specialized statement.
     *
     * @return array
     */
    protected function getStatementStructure()
    {
        return [
            'statement',
            'table',
            'values',
            'where',
        ];
    }

    /**
     * Appends one and only one SET clause, with one or multiple values.
     *
     * @see DatabaseWhereDefinition::buildWhereClauseFromArray()
     * @param array $values
     *  The values to set. Array keys are used as column names and values are substituted
     *  by SQL parameters.
     * @return DatabaseUpdate
     *  The current instance
     */
    public function set(array $values)
    {
        $v = $this->buildWhereClauseFromArray([',' => $values]);
        $this->unsafeAppendSQLPart('values', "SET $v");
        $this->appendValues($values);
        return $this;
    }

    /**
     * Appends one or multiple WHERE clauses.
     * Calling this method multiple times will join the WHERE clauses with a AND.
     *
     * @see DatabaseWhereDefinition::buildWhereClauseFromArray()
     * @param array $conditions
     *  The logical comparison conditions
     * @return DatabaseUpdate
     *  The current instance
     */
    public function where(array $conditions)
    {
        $op = $this->containsSQLParts('where') ? 'AND' : 'WHERE';
        $where = $this->buildWhereClauseFromArray($conditions);
        $this->unsafeAppendSQLPart('where', "$op $where");
        return $this;
    }
}