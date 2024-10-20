import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Skeleton,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

const RenderBlog = (props) => {
  const blog = [...props.blogData];
  const onGetBlog = props.onGetBlog;
  if (blog.length == 0 || !blog)
    return (
      <>
        <h1>Error Geting data from server</h1>
      </>
    );

  const render = () => {
    return (
      <TableContainer>
        <Table variant={"simple"}>
          <TableCaption>Blogs Data from mongodb</TableCaption>
          <Thead>
            <Th>User</Th>
            <Th>author</Th>
            <Th>tittle</Th>
            <Th>Url</Th>
            <Th>Like</Th>
          </Thead>
          <Tbody>
            {blog.map((ele) => (
              <>
                <Tr>
                  <Td>{ele?.user?.username ?? "unknown"}</Td>
                  <Td>{ele?.author ?? "unknown"}</Td>
                  <Td>{ele?.title ?? "unknown"}</Td>
                  <Td>{ele?.user?.username ?? "unknown"}</Td>
                  <Td>{ele?.likes ?? "0"}</Td>
                </Tr>
              </>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  };
  return <>{render()}</>;
};

export default RenderBlog;
