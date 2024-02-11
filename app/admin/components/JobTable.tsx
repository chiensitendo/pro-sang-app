import { Button, Progress, Space, Table, Tag } from "antd";
import styles from "./JobTable.module.scss";
import { TableProps } from "antd/lib";
import { useMemo } from "react";
import { JobItem, JobStatus } from "@/types/admin";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, RetweetOutlined, StepForwardOutlined, SyncOutlined } from "@ant-design/icons";
import moment from "moment";

interface DataType extends JobItem {
  key: string;
}


const JobTable = ({ jobs, count, page, limit, onDelete, onChange }: {
  jobs: JobItem[], count: number,
  onDelete: (jobId: string) => void, page: number, limit: number,
  onChange: (page: number, pageSize: number) => void
}) => {

  const getStatus = (status: JobStatus) => {

    switch (status) {
      case JobStatus.SUCCESS:
        return <Tag icon={<CheckCircleOutlined />} color="success">
          SUCCESS
        </Tag>;
      case JobStatus.FAILED:
        return <Tag icon={<CloseCircleOutlined />} color="error">
          FAILED
        </Tag>;
      case JobStatus.PROCESSING:
        return <Tag icon={<SyncOutlined spin />} color="processing">
          PROCESSING
        </Tag>;
      case JobStatus.PENDING:
        return <Tag icon={<ClockCircleOutlined />} color="default">
          PENDING
        </Tag>;
      case JobStatus.RESTART:
        return <Tag icon={<RetweetOutlined />} color="cyan">
          RESTART
        </Tag>;
      case JobStatus.STARTED:
        return <Tag icon={<StepForwardOutlined />} color="lime">
          STARTED
        </Tag>;
      case JobStatus.INIT:
        return <Tag icon={<InfoCircleOutlined />} color="purple">
          INIT
        </Tag>;
      default:
        return <></>;
    }
  }
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => {
        return getStatus(status);
      },
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Error',
      dataIndex: 'error',
      key: 'error',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Created Time',
      dataIndex: 'created_date',
      key: 'created_date',
      render: (text) => <a>{moment(text).format()}</a>,
    },
    {
      title: 'Updated Time',
      dataIndex: 'updated_date',
      key: 'updated_date',
      render: (text) => <a>{moment(text).format()}</a>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => onDelete(record.id)}>DELETE</Button>
        </Space>
      ),
    },
  ];



  const data = useMemo(() => {
    return jobs.map((j, i) => ({ key: i.toString(), ...j }));
  }, [jobs]);
  return <div className={styles.JobTable}>
    <Table columns={columns} dataSource={data} pagination={{
      current: page,
      pageSize: limit,
      total: count,
      onChange,
    }} />
  </div>
}

export default JobTable;